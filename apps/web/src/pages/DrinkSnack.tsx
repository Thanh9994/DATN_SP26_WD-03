import { useMemo, useState } from 'react';
import { useProducts, type IProduct } from '@web/hooks/useProduct';
import { X, ShoppingCart, ArrowRight } from 'lucide-react';

export interface SnackCartItem {
  productId: string;
  quantity: number;
}

export interface DrinkSnackSelection {
  items: SnackCartItem[];
  totalAmount: number;
}

interface DrinkSnackProps {
  open?: boolean;
  onClose?: () => void;
  onSkip?: () => void;
  onContinue?: (selection: DrinkSnackSelection) => void;
}

const DEFAULT_IMAGE =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuXqeIFfJ3K9cX43NXgLGxfWvV8G5Fby9Rpg&s';

export const DrinkSnack = ({ open, onClose, onSkip, onContinue }: DrinkSnackProps) => {
  const [internalOpen, setInternalOpen] = useState(true);
  const [cart, setCart] = useState<SnackCartItem[]>([]);
  const { products, isLoading, isError } = useProducts();

  const isOpen = open ?? internalOpen;

  const activeProducts = useMemo(() => {
    return (products || []).filter((item) => item.isActive);
  }, [products]);

  const closeModal = () => {
    if (open === undefined) setInternalOpen(false);
    onClose?.();
  };

  const handleSkip = () => {
    onSkip?.();
    closeModal();
  };

  const handleContinue = () => {
    onContinue?.({ items: cart, totalAmount: getCartTotal() });
    if (!onContinue) closeModal();
  };

  const handleAddToCart = (productId: string, quantity: number = 1): void => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...prevCart, { productId, quantity }];
    });
  };

  const getCartTotal = () =>
    cart.reduce((total, item) => {
      const product = activeProducts.find((p) => p._id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);

  const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const renderProductCard = (product: IProduct) => {
    const isFeatured = !!product.isCombo;
    const hasDiscount = Number(product.originalPrice || 0) > Number(product.price || 0);

    return (
      <div
        key={product._id}
        className={`group flex flex-col rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
          isFeatured
            ? 'border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-white/5 shadow-lg shadow-yellow-500/5'
            : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}
      >
        <div className="relative aspect-[12/10] overflow-hidden rounded-md">
          <img
            src={product.image || DEFAULT_IMAGE}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
          {product.isCombo && (
            <span className="absolute left-3 top-3 rounded-full bg-yellow-500 px-3 py-1 text-[10px] font-bold text-black shadow-lg">
              COMBO
            </span>
          )}
          {hasDiscount && (
            <span
              className={`absolute left-3 rounded-full px-3 py-1 text-[10px] font-bold text-white shadow-lg ${product.isCombo ? 'top-10 bg-red-600' : 'top-3 bg-red-600'}`}
            >
              GIẢM {(Number(product.originalPrice) - Number(product.price)).toLocaleString('vi-VN')}
              đ
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3
            className={`line-clamp-1 font-extrabold text-white ${isFeatured ? 'text-lg' : 'text-sm'}`}
          >
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-400">
            {product.description || 'Snack và đồ uống dùng kèm khi xem phim.'}
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-yellow-400">
                {Number(product.price || 0).toLocaleString('vi-VN')}đ
              </span>
              {hasDiscount && (
                <span className="text-xs text-zinc-500 line-through">
                  {Number(product.originalPrice).toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>

            <button
              onClick={() => handleAddToCart(product._id || '', 1)}
              disabled={!product._id}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
                isFeatured
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'border border-white/20 bg-transparent text-white hover:bg-white/10'
              }`}
            >
              {isFeatured ? (
                'Thêm combo'
              ) : (
                <>
                  <ShoppingCart size={14} />
                  Thêm vào đơn
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl">
        {/* Nút Close */}
        <button
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          onClick={handleSkip}
        >
          <X size={24} />
        </button>

        {/* Header Cố định */}
        <div className="flex-shrink-0 px-5 pb-2 pt-4 text-center">
          <span className="block text-[11px] font-bold uppercase tracking-[3px] text-red-600">
            Danh sách Sản phẩm
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            Gợi ý đồ uống & bỏng ngô & Combos
          </h2>
        </div>

        {/* Thân Modal - Cuộn nội dung */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-10 pb-8">
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-white/10 text-zinc-500">
              Đang tải danh sách sản phẩm...
            </div>
          ) : isError ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-red-500/20 text-red-400">
              Không tải được sản phẩm từ hệ thống.
            </div>
          ) : !activeProducts.length ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-white/10 text-zinc-500">
              Hiện chưa có sản phẩm đang bán.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {activeProducts.map((product) => renderProductCard(product))}
            </div>
          )}
        </div>

        {/* Footer Cố định */}
        <div className="flex flex-shrink-0 flex-col items-center justify-between border-t border-white/10 bg-[#1e1e1e] px-5 py-4 sm:flex-row">
          <button
            className="mb-4 text-xs text-zinc-500 underline transition-colors hover:text-white sm:mb-0"
            onClick={handleSkip}
          >
            Bỏ qua và tiếp tục thanh toán
          </button>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400">
                Tổng ( {getCartCount()} món ):
              </span>
              <span className="text-xl font-black text-red-600">
                {getCartTotal().toLocaleString('vi-VN')}đ
              </span>
            </div>

            <button
              className="group flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white transition-all hover:bg-red-500 hover:shadow-lg hover:shadow-red-600/30 active:scale-95"
              onClick={handleContinue}
            >
              Thêm & Tiếp tục
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkSnack;
