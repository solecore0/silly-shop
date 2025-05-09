// store.js
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import adminNavReducer from "./adminNav";
import productReducer from "./product";
import userReducer from "./user";
import chartReducer from "./charts";
import orderReducer from "./order";
import cartReducer from "./cartSlice";
import cuponReducer from "./cuponSlice";


const store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
    adminNav: adminNavReducer,
    product: productReducer,
    chart: chartReducer,
    order: orderReducer,
    cart: cartReducer,
    coupon: cuponReducer,
  },
});

export default store;
