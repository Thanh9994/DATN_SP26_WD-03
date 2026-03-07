import React, { useState } from "react";
import "../styles/RecommentDrinkSnack.css";

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  isFeatured?: boolean;
  badge?: {
    text: string;
    color: "gold" | "red";
  };
  savingPercent?: number;
}

interface CartItem {
  productId: string;
  quantity: number;
}

export const RecommentDrinkSnack = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  const products: Product[] = [
    {
      id: "mega-combo",
      title: "Mega Movie Combo",
      image: "🥤",
      price: 25.0,
      originalPrice: 32.0,
      isFeatured: true,
      badge: { text: "LIMITED OFFER", color: "gold" },
      savingPercent: 22,
    },
    {
      id: "large-popcorn",
      title: "Large Popcorn Combo",
      image: "🍿",
      price: 14.5,
      originalPrice: 18.0,
    },
    {
      id: "nachos",
      title: "Nachos with Extra Cheese",
      image: "🧀",
      price: 12.0,
    },
    {
      id: "soda",
      title: "Ice Cold Soda",
      image: "🥤",
      price: 6.5,
    },
  ];

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

  const renderProductCard = (product: Product): JSX.Element => (
    <div
      key={product.id}
      className={`recommend-card ${product.isFeatured ? "featured" : ""}`}
    >
      <div className="card-image-wrapper">
        <div className="card-image">{product.image}</div>
        {product.badge && (
          <div className={`card-badge badge-${product.badge.color}`}>
            {product.badge.text}
          </div>
        )}
        {product.savingPercent && (
          <div className="card-badge badge-save">
            SAVE {product.savingPercent}%
          </div>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <div className="card-prices">
          <span className="card-price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="card-original-price">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <button
        className={`card-btn ${product.isFeatured ? "btn-claim" : "btn-add"}`}
        onClick={() => handleAddToCart(product.id, 1)}
      >
        {product.isFeatured ? (
          <>⊕ Claim Offer</>
        ) : (
          <>🛒 Add to Order</>
        )}
      </button>
    </div>
  );

  if (!isOpen) return <></>;

  return (
    <div className="recommend-overlay">
      <div className="recommend-modal">
        <button
          className="recommend-close"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        <div className="recommend-header">
          <span className="recommend-subtitle">ENHANCE YOUR EXPERIENCE</span>
          <h2 className="recommend-title">Recommended for You</h2>
        </div>

        <div className="recommend-carousel">
          {products.map((product) => renderProductCard(product))}
        </div>

        <div className="recommend-footer">
          <button
            className="recommend-skip"
            onClick={() => setIsOpen(false)}
          >
            No thanks, go to Checkout
          </button>

          <button className="recommend-continue">
            Add & Continue
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default RecommentDrinkSnack;