// src/redux/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks for fetching data from backend
export const fetchProductInfo = createAsyncThunk(
  "product/fetchProductInfo",
  async () => {
    const response = await axios.get(
      "http://localhost:4000/api/v1/product/latest"
    );
    return response.data.products;
  }
);

export const fetchProductSearch = createAsyncThunk(
  "product/fetchProductSearch",
  async (query) => {
    const response = await axios.get(
      `http://localhost:4000/api/v1/product/find?name=${query}`
    );
    return response.data.products;
  }
);

export const fetchProductId = createAsyncThunk(
  "product/fetchProductId",
  async (id) => {
    const response = await axios.get(
      `http://localhost:4000/api/v1/product/${id}`
    );
    return response.data.products;
  }
);

export const fetchCategories = createAsyncThunk(
  "product/fetchCategories",
  async () => {
    const response = await axios.get(
      "http://localhost:4000/api/v1/product/categories"
    );
    return response.data.categories;
  }
);

// Add new thunk for fetching all products
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        "http://localhost:4000/api/v1/product/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log("🚀 Sending product data:", formData);
      const response = await axios.post(
        "http://localhost:4000/api/v1/product/new",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    productInfo: [],
    productSearch: [],
    productId: [],
    categories: [],
    allProducts: [],
    status: "idle",
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductInfo.fulfilled, (state, action) => {
        state.productInfo = action.payload;
      })
      .addCase(fetchProductSearch.fulfilled, (state, action) => {
        state.productSearch = action.payload;
      })
      .addCase(fetchProductId.fulfilled, (state, action) => {
        state.productId = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProducts = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.allProducts.push(action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export default productSlice.reducer;
