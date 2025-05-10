import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/productInfo.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductId , createReview} from "../redux/product";
import { addToCart } from "../redux/cartSlice";
import config from "../config";
import { toast } from "react-toastify";

const ProductInfo = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(1);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchProductId(id));
  }, [id, dispatch]);

  const data = useSelector((state) => state.product.productId);
  console.log(data);

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

  const submitReview = () => {
    if (!rating || !reviewText.trim()) {
      toast.error("Please provide a rating and review.");
      return;
    }
    const reviewData = {
      productId: data._id,
      rating,
      comment: reviewText,
    };
    dispatch(createReview(reviewData));
    console.log("Submitted review:", { rating, reviewText });
    toast.success("Review submitted!");
    setRating(0);
    setReviewText("");
  };

  if (!data) return <div>Loading...</div>;

  const addPhotoIndex = () => {
    if (photoIndex === data?.photos.length - 1) {
      setPhotoIndex(0);
    } else {
      setPhotoIndex(photoIndex + 1);
    }
  };

  const subtractPhotoIndex = () => {
    if (photoIndex === 0) {
      setPhotoIndex(data?.photos.length - 1);
    } else {
      setPhotoIndex(photoIndex - 1);
    }
  };

  return (
    <div className="container">
      <div className="Cmain">
        <div className="ProductImage">
          <img
            src={`${config.UPLOADS_URL}${data.photos[photoIndex]}`}
            alt={data.name}
          />
          <div className="img-change">
            <button onClick={subtractPhotoIndex}>&lt;</button>
            <button onClick={addPhotoIndex}>&gt;</button>
          </div>
        </div>
        <div className="details">
          <h2>{data.name}</h2>
          <p>${data.price}</p>
          <p>Rating: {data.avgRating}⭐ </p>
          <p>{data.description}</p>
          <div className="amo">
            <span
              className="inc"
              onClick={() => {
                if (isPrevAmo) {
                  setAmount(Math.max(1, amount - 1));
                }
              }}>
              -
            </span>
            <span>{amount}</span>
            <span
              className="inc"
              onClick={() => {
                if (isNextAmo) {
                  setAmount(Math.min(data.stock, amount + 1));
                }
              }}>
              +
            </span>
          </div>
          <button onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>
      <hr />
      <div className="reviews">
        <h2>Reviews</h2>
        <div className="add-review">
          <h2>Add Your Experience.</h2>

          <div className="stars" id="starRating">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                data-rating={num}
                onClick={() => setRating(num)}
                className={rating >= num ? "active" : ""}
                style={{ cursor: "pointer" }}>
                ★
              </span>
            ))}
          </div>

          <div className={`textarea-wrapper ${reviewText ? "filled" : ""}`}>
            <textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required></textarea>
            <label htmlFor="review" className="placeholder">
              Write your review...
            </label>
          </div>
          <button onClick={submitReview}>Submit Review</button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
