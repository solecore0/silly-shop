import React from "react";
import "../css/cart.css";
import CardItem from "../components/CardItem";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Cart() {

  const navigate = useNavigate();

  const data = [
    {
      id: 1,
      img: "https://m.media-amazon.com/images/I/81Fm0tRFdHL.__AC_SY445_SX342_QL70_FMwebp.jpg",
      name: "Airforce",
      price: "$30",
      amount: 1,
    },
    
  ];

  
  const removeItem = () => {};
  
  const screenWidth = useSelector((state) => state.ui.screenWidth);
  return (
    <div className="cart">
      <h1>Cart</h1>
      <div className="data">
        <div className="items">
          {data.map((item) => (
            <CardItem key={item.id} item={item} removeItem={removeItem} />
          ))}
        </div>
        <div className="Total">
          <h2>Total</h2>
          {screenWidth > 1024 ? data.map((item) => (
           <div className="wrap">
              <span>{item.name}</span>
              <span>{item.price}</span>
            </div>
          )) : ""}
          <p>$100</p>
        </div>
      </div>
      <button className="orderBtn" onClick={()=>{navigate("/OrderInformation")}}>Order</button>
    </div>
  );
}

export default Cart;
