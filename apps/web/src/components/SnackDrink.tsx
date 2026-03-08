import React, { useState } from "react";
import "./DrinkSnack.css";

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
  featured?: boolean;
  isFeatured?: boolean;
}

interface CartItem {
  productId: string;
  quantity: number;
}

export const DrinkSnack = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  const products: Product[] = [
    {
      id: "mega-combo",
      title: "Mega Movie Combo",
      description: "Extra-large popcorn, two sodas, and a box of signature movie candy.",
      image: "🥤",
      price: 25.0,
      originalPrice: 32.0,
      badge: {
        text: "LIMITED TIME OFFER",
        color: "gold",
      },
      isFeatured: true,
    },
    {
      id: "family-pack",
      title: "Family Fun Pack",
      description: "2 Large Popcorns + 4 Sodas",
      image: "🍿",
      price: 38.5,
    },
    {
      id: "sweet-salty",
      title: "Sweet & Salty Duo",
      description: "Medium Popcorn + Choco Pretzels",
      image: "🧂",
      price: 16.0,
    },
    {
      id: "large-popcorn",
      title: "Large Popcorn Combo",
      description: "1 Large Popcorn + 2 Sodas",
      image: "🍿",
      price: 18.5,
    },
    {
      id: "nachos-supreme",
      title: "Nachos Supreme",
      description: "Premium nachos with all toppings",
      image: "🧀",
      price: 12.5,
    },
    {
      id: "candy-box",
      title: "Movie Candy Mix",
      description: "Assorted candy selection",
      image: "🍬",
      price: 8.0,
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

  const renderBadge = (badge: Product["badge"]): JSX.Element | null => {
    if (!badge) return null;
    return (
      <div className={`product-badge badge-${badge.color}`}>
        {badge.text}
      </div>
    );
  };

  const renderSaveBadge = (price: number, originalPrice?: number): JSX.Element | null => {
    if (!originalPrice || originalPrice <= price) return null;
    const savings = (originalPrice - price).toFixed(2);
    return <div className="product-badge badge-save">SAVE ${savings}</div>;
  };

  const renderProductCard = (product: Product): JSX.Element => (
    <div
      key={product.id}
      className={`product-card ${product.isFeatured ? "featured" : ""}`}
    >
      <div className="product-image-wrapper">
        <div className="product-image">{product.image}</div>
        {product.badge && renderBadge(product.badge)}
        {renderSaveBadge(product.price, product.originalPrice)}
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
              onClick={() => handleAddToCart(product.id, 1)}
            >
              Claim Exclusive Offer
            </button>
          ) : (
            <button
              className="btn-add-order"
              onClick={() => handleAddToCart(product.id, 1)}
            >
              <span className="cart-icon">🛒</span>
              Add to Order
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
              <span className="modal-subtitle">ENHANCE YOUR MOVIE EXPERIENCE</span>
              <h1 className="modal-title">Recommended Snacks & Combos</h1>
            </div>

            <div className="products-grid">
              {products.map((product) => renderProductCard(product))}
            </div>

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
                  <span className="total-value">${getCartTotal().toFixed(2)}</span>
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