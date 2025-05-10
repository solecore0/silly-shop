import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/productInfo.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductId } from "../redux/product";
import { addToCart } from "../redux/cartSlice";
import config from "../config";
import { toast } from "react-toastify";

const ProductInfo = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(1);
  const [photoIndex, setPhotoIndex] = useState(0);
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
        photo: data.thumbnail,
        stock: data.stock,
        quantity: amount,
      })
    );
  };

  if (!data) return <div>Loading...</div>;

  const addPhotoIndex = () => {
    if (photoIndex === data.photos.length - 1) {
      setPhotoIndex(0);
    } else {
      setPhotoIndex(photoIndex + 1);
    }
  };

  const subtractPhotoIndex = () => {
    if (photoIndex === 0) {
      setPhotoIndex(data.photos.length - 1);
    } else {
      setPhotoIndex(photoIndex - 1);
    }
  };

  return (
    <>
      <div className="Cmain">
        <div className="ProductImage">
          <img src={`${config.UPLOADS_URL}${data.photos[photoIndex]}`} alt={data.name} />
          <div className="img-change">
          <button onClick={subtractPhotoIndex}>&lt;</button>
          <button onClick={addPhotoIndex}>&gt;</button>
          </div>
        </div>
        <div className="details">
          <h2>{data.name}</h2>
          <p>${data.price}</p>
          <p>{data.description}</p>
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
