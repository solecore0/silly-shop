import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/productInfo.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductId } from "../redux/product";
import { addToCart } from "../redux/cartSlice";
import config from "../config";
import { toast } from "react-hot-toast";

const ProductInfo = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchProductId(id));
  }, [id, dispatch]);

  const data = useSelector((state) => state.product.productId);

  const isPrevAmo = amount > 1;
  const isNextAmo = amount < (data?.stock || 0);

  const handleAddToCart = () => {
    if (!data) return;

    if (amount <= 0 || amount > data.stock) {
      toast.error("Invalid quantity");
      return;
    }

    dispatch(
      addToCart({
        _id: data._id,
        name: data.name,
        price: data.price,
        photo: data.photo,
        stock: data.stock,
        quantity: amount,
      })
    );
  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <div className="Cmain">
        <div className="Showcase">
          <img src={`${config.UPLOADS_URL}${data.photo}`} alt={data.name} />
          <div className="cover"></div>
        </div>
        <div className="details">
          <h2>{data.name}</h2>
          <p>${data.price}</p>
          <p>{data.stock} in stock</p>
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
                  setAmount(Math.min(data.stock, amount + 1));
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
