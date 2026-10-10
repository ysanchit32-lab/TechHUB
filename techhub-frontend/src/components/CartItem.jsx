import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  return (
    <div className="cart-item">

      <img src={item.image} alt={item.name} />

      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>{item.category}</p>
        <strong>₹{item.price.toLocaleString()}</strong>
      </div>

      <div className="quantity-control">
        <button onClick={() => decreaseQuantity(item.id)}>
          −
        </button>

        <span>{item.quantity}</span>

        <button onClick={() => increaseQuantity(item.id)}>
          +
        </button>
      </div>

      <div className="cart-item-total">
        ₹{(item.price * item.quantity).toLocaleString()}
      </div>

      <button
        className="remove-button"
        onClick={() => removeFromCart(item.id)}
      >
        ✕
      </button>

    </div>
  );
}

export default CartItem;