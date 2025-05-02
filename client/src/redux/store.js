// store.js
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import adminNavSlice from './adminNav.js';
import produdctSlice from './product.js';
import userReducer from './user.js';
import  chartSlice  from './charts.js';
 const store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
    adminNav: adminNavSlice,
    product: produdctSlice,
    chart: chartSlice,
  },
});

export default store;