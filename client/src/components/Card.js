import React from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

const Card = ({ item }) => {
  const navigate = useNavigate();

  const goToProduct = () => {
    navigate(`/product/${item._id}`);
  };

  return (
    <div className="card">
      <div className="im">
        <img src={`${config.UPLOADS_URL}${item.photo}`} alt="" />
      </div>
      <h3>{item.name}</h3>
      <p>${item.price}</p>
      <button className="btn" onClick={goToProduct}>
        Show More
      </button>
    </div>
  );
};

export default Card;
