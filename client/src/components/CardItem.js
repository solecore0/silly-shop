import React from "react";

const CardItem = ({ item }) => {
  const addItem = () => {
    item.amount = item.amount + 1;
  };

  const subItem = () => {
    if (item.amount !== 1) {
      item.amount = item.amount - 1;
    } else {
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
        <button>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

export default CardItem;
