import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails, updateOrder } from "../redux/order";
import Loader from "../components/Loader";
import config from "../config";
import "../css/orderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, status } = useSelector((state) => state.order);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  const handleUpdateStatus = async () => {
    await dispatch(updateOrder(id));
    // Refresh order details after update
    dispatch(fetchOrderDetails(id));
  };

  if (status === "loading") return <Loader />;
  if (!currentOrder) return <div>Order not found</div>;

  const isAdmin = user?.role === "admin";
  const canUpdateStatus = isAdmin && currentOrder.status !== "Delivered";

  return (
    <div className="order-details">
      <h1>Order Details</h1>
      <div className="order-info">
        <p>
          <strong>Order ID:</strong> {currentOrder._id}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={currentOrder.status.toLowerCase()}>
            {currentOrder.status}
          </span>
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(currentOrder.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="shipping-info">
        <h2>Shipping Information</h2>
        <p>
          <strong>Address:</strong> {currentOrder.shippingInfo.address}
        </p>
        <p>
          <strong>Payment Method:</strong>{" "}
          {currentOrder.shippingInfo.paymentMethod}
        </p>
        <p>
          <strong>Delivery Method:</strong>{" "}
          {currentOrder.shippingInfo.deliveryMethod}
        </p>
      </div>

      <div className="order-items">
        <h2>Order Items</h2>
        <div className="items-list">
          {currentOrder.orderItems.map((item) => (
            <div key={item._id} className="order-item">
              <img src={`${config.UPLOADS_URL}${item.photo}`} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="summary-details">
          <p>
            <strong>Subtotal:</strong> ${currentOrder.subtotal}
          </p>
          <p>
            <strong>Shipping:</strong> ${currentOrder.shippingCharges}
          </p>
          <p>
            <strong>Tax:</strong> ${currentOrder.tax}
          </p>
          {currentOrder.discount > 0 && (
            <p>
              <strong>Discount:</strong> -${currentOrder.discount}
            </p>
          )}
          <p className="total">
            <strong>Total:</strong> ${currentOrder.total}
          </p>
        </div>
      </div>

      {canUpdateStatus && (
        <div className="admin-actions">
          <button onClick={handleUpdateStatus}>
            Update to{" "}
            {currentOrder.status === "Processing" ? "Shipped" : "Delivered"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
