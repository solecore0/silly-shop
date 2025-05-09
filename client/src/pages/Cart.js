import React from "react";
import "../css/cart.css";
import CardItem from "../components/CardItem";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import config from "../config";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const { items, total } = useSelector((state) => state.cart);
  const screenWidth = useSelector((state) => state.ui.screenWidth);

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateQuantity({ _id: id, quantity }));
  };

  const handleOrder = () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    navigate("/OrderInformation");
  };

  const handleContinueShopping = () => {
    navigate("/search");
  };

  return (
    <div className="cart">
      <h1>Cart</h1>
      <div className="data">
        <div className="items">
          {items.length > 0 ? (
            items.map((item) => (
              <CardItem
                key={item._id}
                item={{
                  ...item,
                  img: `${config.UPLOADS_URL}${item.photo}`,
                  price: `$${item.price}`,
                }}
                removeItem={() => handleRemoveItem(item._id)}
                updateQuantity={(qty) => handleUpdateQuantity(item._id, qty)}
              />
            ))
          ) : (
            <div className="empty-cart-message">Your cart is empty</div>
          )}
        </div>
        {items.length > 0 && (
          <div className="Total">
            <h2>Recipt</h2>
            {screenWidth > 1024 && (
              <div className="items-summary">
                {items.map((item) => (
                  <div className="wrap" key={item._id}>
                    <span>{item.name}</span>
                    <span>${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}
            <p> Total:${total}</p>
          </div>
        )}
      </div>
      <button
        className="orderBtn"
        onClick={items.length > 0 ? handleOrder : handleContinueShopping}
      >
        {items.length === 0
          ? "Continue Shopping"
          : !user
          ? "Login to Order"
          : "Order Now"}
      </button>
    </div>
  );
}

export default Cart;
