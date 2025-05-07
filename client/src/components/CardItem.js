import React from "react";

const CardItem = ({ item, removeItem, updateQuantity }) => {
  const handleQuantityChange = (change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      updateQuantity(newQuantity);
    }
  };

  return (
    <div className="cardItem">
      <div className="product">
        <img src={item.img} alt={item.name} />
        <span className="productInfo">
          <h3>{item.name}</h3>
          <p>{item.price}</p>
        </span>
      </div>
      <div className="quantity">
        <button
          onClick={() => handleQuantityChange(-1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(1)}
          disabled={item.quantity >= item.stock}
        >
          +
        </button>
      </div>
      <button className="remove" onClick={removeItem}>
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
};

export default CardItem;
