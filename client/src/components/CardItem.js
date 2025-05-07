import React from "react";

const CardItem = ({ item, removeItem, updateQuantity }) => {
  const handleQuantityChange = (change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      updateQuantity(newQuantity);
    }
  };

  return (
    <div className="Citem">
      <div className="itemData">
        <img src={item.img} alt="" />
        <div className="names flex justify-between">
          <h2>{item.name}</h2>
          <p>{item.price}</p>
        </div>
      </div>

      <div className="actions">
        <div className="amount">
          <span className="inc" onClick={addItem}>
            +
          </span>
          <p>{item.amount}</p>
          <span className="inc" onClick={subItem}>
            -
          </span>
        </div>
        <i className="fa-solid fa-xmark"></i>
      </div>
    </div>
  );
};

export default CardItem;
