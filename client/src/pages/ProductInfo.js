import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/productInfo.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductId } from "../redux/product";

const ProductInfo = () => {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchProductId(id));
  }, [id]);

  const data = useSelector((state) => state.product.productId);

  const isPrevAmo = amount > 1;
  const isNextAmo = amount < data?.stock;

  const handleAddToCart = () => {
    if (amount <= 0 || amount > data?.stock) {
      alert("Invalid quantity");
      return;
    }
    // Add to cart logic here
  };

  return (
    <>
      <div className="Cmain">
        <div className="Showcase">
          <img src={`http://localhost:4000/${data?.photo}`} alt="img" />
          <div className="cover"></div>
        </div>
        <div className="details">
          <h2>{data?.name}</h2>
          <p>${data?.price}</p>
          <p>{data?.stock} in stock</p>
          <div className="amo">
            <span
              className="inc"
              onClick={() => {
                if (isPrevAmo) {
                  setAmount(Math.max(1, amount - 1));
                }
              }}
            >
              -
            </span>
            <span>{amount}</span>
            <span
              className="inc"
              onClick={() => {
                if (isNextAmo) {
                  setAmount(Math.min(data?.stock || 10, amount + 1));
                }
              }}
            >
              +
            </span>
          </div>
          <button onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>
    </>
  );
};

export default ProductInfo;
