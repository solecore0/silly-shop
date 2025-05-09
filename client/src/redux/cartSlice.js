import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-toastify";

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) {
      return {
        items: [],
        total: 0,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      items: [],
      total: 0,
    };
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadState(),
  reducers: {
    addToCart: (state, action) => {
      const { _id, name, price, photo, stock } = action.payload;
      const quantity = action.payload.quantity || 1;

      const existingItem = state.items.find((item) => item._id === _id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= stock) {
          existingItem.quantity = newQuantity;
          toast.success("Item quantity updated in cart");
        } else {
          toast.error("Not enough stock available");
        }
      } else {
        if (quantity <= stock) {
          state.items.push({ _id, name, price, photo, quantity, stock });
          toast.success("Item added to cart");
        } else {
          toast.error("Not enough stock available");
        }
      }

      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      localStorage.setItem("cart", JSON.stringify(state));
      toast.success("Item removed from cart");
    },
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === _id);

      if (item) {
        if (quantity <= item.stock && quantity > 0) {
          item.quantity = quantity;
          state.total = state.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          localStorage.setItem("cart", JSON.stringify(state));
          toast.success("Cart updated");
        } else {
          toast.error("Invalid quantity");
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
