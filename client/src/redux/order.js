import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import {toast} from "react-toastify";
import { clearCart } from "./cartSlice";

// Create new order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order/new", orderData);
      toast.success(response.data.message);
      dispatch(clearCart());
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Get user's orders
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/order/my");
      return response.data.orders;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Get all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/order/all");
      return response.data.orders;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch all orders"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Get order details
export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/order/${orderId}`);
      return response.data.order;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch order details"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Update order status (admin only)
export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${orderId}`);
      if (response.data.success) {
        toast.success("Order status updated successfully!");
        return { orderId, updatedOrder: response.data.order };
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    allOrders: [],
    currentOrder: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create order cases
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add the new order to both arrays if it exists in the response
        if (action.payload.order) {
          state.orders = [action.payload.order, ...state.orders];
          state.allOrders = [action.payload.order, ...state.allOrders];
        }
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch my orders cases
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch all orders cases
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch order details cases
      .addCase(fetchOrderDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update order cases
      .addCase(updateOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the order in all relevant places
        if (action.payload.updatedOrder) {
          // Update in currentOrder if it matches
          if (state.currentOrder?._id === action.payload.orderId) {
            state.currentOrder = action.payload.updatedOrder;
          }
          // Update in allOrders if it exists
          const allOrdersIndex = state.allOrders.findIndex(
            (order) => order._id === action.payload.orderId
          );
          if (allOrdersIndex !== -1) {
            state.allOrders[allOrdersIndex] = action.payload.updatedOrder;
          }
          // Update in orders if it exists
          const ordersIndex = state.orders.findIndex(
            (order) => order._id === action.payload.orderId
          );
          if (ordersIndex !== -1) {
            state.orders[ordersIndex] = action.payload.updatedOrder;
          }
        }
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
