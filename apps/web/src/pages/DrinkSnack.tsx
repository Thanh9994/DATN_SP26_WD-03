import { useMemo, useState } from 'react';
import { useProducts, type IProduct } from '@web/hooks/useProduct';
import '../styles/DrinkSnack.css';

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

export const DrinkSnack = ({ open, onClose, onSkip, onContinue }: DrinkSnackProps): React.ReactNode => {
  const [internalOpen, setInternalOpen] = useState(true);
  const [cart, setCart] = useState<SnackCartItem[]>([]);
  const { products, isLoading, isError } = useProducts();

  const isOpen = open ?? internalOpen;

  const activeProducts = useMemo(() => {
    return (products || []).filter((item) => item.isActive);
  }, [products]);

  const closeModal = () => {
    if (open === undefined) {
      setInternalOpen(false);
    }
    onClose?.();
  };

  const handleSkip = () => {
    onSkip?.();
    closeModal();
  };

  const handleContinue = () => {
    onContinue?.({
      items: cart,
      totalAmount: getCartTotal(),
    });

    if (!onContinue) {
      closeModal();
    }
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

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => {
      const product = activeProducts.find((p) => p._id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartCount = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const renderSaveBadge = (price: number, originalPrice?: number): React.ReactNode | null => {
    if (!originalPrice || originalPrice <= price) return null;

    const savings = originalPrice - price;
    return <div className="product-badge badge-save">Giảm {savings.toLocaleString('vi-VN')}đ</div>;
  };

  const renderProductCard = (product: IProduct): React.ReactNode => {
    const isFeatured = !!product.isCombo;
    const hasDiscount = Number(product.originalPrice || 0) > Number(product.price || 0);

    return (
      <div key={product._id} className={`product-card ${isFeatured ? 'featured' : ''}`}>
        <div className="product-image-wrapper">
          <img
            src={product.image || DEFAULT_IMAGE}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />

          {product.isCombo && <div className="product-badge badge-gold">COMBO</div>}

          {hasDiscount && renderSaveBadge(product.price, product.originalPrice)}
        </div>

        <div className="product-content">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-description">
            {product.description || 'Snack và đồ uống dùng kèm khi xem phim.'}
          </p>

          <div className="product-footer">
            <div className="product-price-wrapper">
              <span className="product-price">
                {Number(product.price || 0).toLocaleString('vi-VN')}đ
              </span>

              {!!product.originalPrice && product.originalPrice > product.price && (
                <span className="product-original-price">
                  {Number(product.originalPrice).toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>

            <button
              className={product.isCombo ? 'btn-exclusive' : 'btn-add-order'}
              onClick={() => handleAddToCart(product._id || '', 1)}
              disabled={!product._id}
            >
              {product.isCombo ? (
                'Thêm combo'
              ) : (
                <>
                  <span className="cart-icon">🛒</span>
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
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={handleSkip}>
          ✕
        </button>

        <div className="modal-header">
          <span className="modal-subtitle">ENHANCE YOUR MOVIE EXPERIENCE</span>
          <h1 className="modal-title">Recommended Snacks & Combos</h1>
        </div>

        {isLoading ? (
          <div className="state-box">Đang tải danh sách sản phẩm...</div>
        ) : isError ? (
          <div className="state-box error">Không tải được sản phẩm từ hệ thống.</div>
        ) : !activeProducts.length ? (
          <div className="state-box">Hiện chưa có sản phẩm đang bán.</div>
        ) : (
          <div className="products-grid">
            {activeProducts.map((product) => renderProductCard(product))}
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-skip" onClick={handleSkip}>
            Bỏ qua và tiếp tục thanh toán
          </button>

          <div className="footer-right">
            <div className="total-price">
              <span className="total-label">Tổng ({getCartCount()} món):</span>
              <span className="total-value">{getCartTotal().toLocaleString('vi-VN')}đ</span>
            </div>

            <button className="btn-continue" onClick={handleContinue}>
              Thêm & Tiếp tục
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkSnack;
