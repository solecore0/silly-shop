import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, fetchMyOrders } from "../redux/order";
import { toast } from "react-hot-toast";

const OrderInformation = () => {
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [delivery, setDelivery] = useState("");
  const [coupon, setCoupon] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items) || [];
  const user = useSelector((state) => state.user.user);

  const validateForm = () => {
    // some temporary form validation logics
    if (!address || !pinCode || !city || !state || !country) {
      toast.error("Please fill all the fields");
      return false;
    }
    if (pinCode.length !== 6) {
      toast.error("Pin code must be 6 digits");
      return false;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }
    if (!delivery) {
      toast.error("Please select a delivery method");
      return false;
    }
    return true;
  };

  const calculateShippingCharges = () => {
    return delivery === "express" ? 15 : 5;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const shippingCharges = calculateShippingCharges();
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const tax = subtotal * 0.1; // 10% tax

      const orderData = {
        shippingInfo: {
          address,
          pinCode,
          city,
          state,
          country,
        },
        orderItems: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          photo: item.photo,
          productId: item._id,
        })),
        user: user._id,
        subtotal,
        tax,
        shippingCharges,
        discount: 0,
        total: subtotal + tax + shippingCharges,
        coupon: coupon || undefined,
      };

      const result = await dispatch(createOrder(orderData));
      if (!result.error) {
        // Add a small delay before fetching orders to ensure cache is invalidated
        setTimeout(async () => {
          await dispatch(fetchMyOrders());
          navigate("/order");
        }, 1000);
      }
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
        </div>
        <div>
          <input
            type="text"
            value={city}
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            value={state}
            placeholder="State"
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            value={country}
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            value={pinCode}
            placeholder="Pin Code"
            onChange={(e) => setPinCode(e.target.value)}
          />
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
        </div>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderInformation;
