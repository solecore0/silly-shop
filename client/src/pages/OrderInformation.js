import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderInformation = () => {
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("");
  const [delivery, setDelivery] = useState("");
  const [coupon, setCoupon] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!address.trim()) newErrors.address = "Address is required";
    if (!payment.trim()) newErrors.payment = "Payment method is required";
    if (!delivery.trim()) newErrors.delivery = "Delivery method is required";

    // Validate coupon format if provided
    if (coupon && !/^[A-Za-z0-9-]+$/.test(coupon)) {
      newErrors.coupon = "Invalid coupon format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Process order
      navigate("/order");
    }
  };

  return (
    <div id="order-registery" className="registery" >
      <h1>Order Info</h1>
      <form className="inp" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={address}
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value.slice(0, 200))}
          />
          {errors.address && (
            <span className="error" style={{ color: "red" }}>
              {errors.address}
            </span>
          )}
        </div>
        <div>
          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className={payment ? "" : "placeholder"}
          >
            <option value="" disabled>
              Select Payment Method
            </option>
            <option value="card">Card</option>
            <option value="cash">Cash on Delivery</option>
          </select>
          {errors.payment && (
            <span className="error" style={{ color: "red" }}>
              {errors.payment}
            </span>
          )}
        </div>
        <div>
          <select
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
            className={delivery ? "" : "placeholder"}
          >
            <option value="" disabled>
              Select Delivery Method
            </option>
            <option value="standard">Standard Delivery</option>
            <option value="express">Express Delivery</option>
          </select>
          {errors.delivery && (
            <span className="error" style={{ color: "red" }}>
              {errors.delivery}
            </span>
          )}
        </div>
        <div>
          <input
            type="text"
            value={coupon}
            placeholder="Coupon-Code"
            onChange={(e) =>
              setCoupon(e.target.value.toUpperCase().slice(0, 20))
            }
          />
          {errors.coupon && (
            <span className="error" style={{ color: "red" }}>
              {errors.coupon}
            </span>
          )}
        </div>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderInformation;
