import { useMemo, useState } from "react";
import "../styles/DrinkSnack.css";
import { useFoodDrink } from "@web/hooks/useFoodDrink";

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  badge?: {
    text: string;
    color: "gold" | "red";
  };
  isFeatured?: boolean;
}

interface CartItem {
  productId: string;
  quantity: number;
}

export const DrinkSnack = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  const { foodDrinks, isLoading } = useFoodDrink();

  const products: Product[] = useMemo(() => {
    if (!Array.isArray(foodDrinks)) return [];

    return foodDrinks.map((item: any) => ({
      id: item._id,
      title: item.ten_mon,
      description: item.mo_ta,
      image: item.hinh_anh,
      price: item.gia_ban,
      originalPrice: item.gia_goc,
      isFeatured: item.la_noi_bat,
      badge: item.badge
        ? {
            text: item.badge,
            color: item.badge.includes("LIMITED") ? "gold" : "red",
          }
        : undefined,
    }));
  }, [foodDrinks]);

  const handleAddToCart = (productId: string, quantity: number = 1): void => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId);

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, { productId, quantity }];
    });
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const renderBadge = (badge: Product["badge"]) => {
    if (!badge) return null;

    return (
      <div className={`product-badge badge-${badge.color}`}>
        {badge.text}
      </div>
    );
  };

  const renderSaveBadge = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return null;

    const savings = (originalPrice - price).toFixed(2);

    return (
      <div className="product-badge badge-save">
        SAVE ${savings}
      </div>
    );
  };

  const renderProductCard = (product: Product) => (
    <div
      key={product.id}
      className={`product-card ${product.isFeatured ? "featured" : ""}`}
    >
      <div className="product-image-wrapper">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="product-image-real"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.add("show");
            }}
          />
        ) : null}
        <div className="product-image">🍿</div>

        <div className="product-badge-group">
          {product.badge && renderBadge(product.badge)}
          {renderSaveBadge(product.price, product.originalPrice)}
        </div>
      </div>

      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div className="product-price-wrapper">
            <span className="product-price">${product.price.toFixed(2)}</span>

            {product.originalPrice && (
              <span className="product-original-price">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {product.isFeatured ? (
            <button
              className="btn-exclusive"
              onClick={() => handleAddToCart(product.id)}
            >
              CLAIM EXCLUSIVE OFFER
            </button>
          ) : (
            <button
              className="btn-add-order"
              onClick={() => handleAddToCart(product.id)}
            >
              <span className="cart-icon">🛒</span>
              ADD TO ORDER
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button
              className="modal-close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <div className="modal-header">
              <span className="modal-subtitle">
                ENHANCE YOUR MOVIE EXPERIENCE
              </span>
              <h1 className="modal-title">
                Recommended Snacks & Combos
              </h1>
            </div>

            {isLoading ? (
              <div style={{ color: "white", textAlign: "center", padding: "40px" }}>
                Loading...
              </div>
            ) : (
              <div className="products-grid">
                {products.map(renderProductCard)}
              </div>
            )}

            <div className="modal-footer">
              <button
                className="btn-skip"
                onClick={() => setIsOpen(false)}
              >
                No thanks, go to Checkout
              </button>

              <div className="footer-right">
                <div className="total-price">
                  <span className="total-label">Total:</span>
                  <span className="total-value">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>

                <button className="btn-continue">
                  Add & Continue
                  <span className="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DrinkSnack;