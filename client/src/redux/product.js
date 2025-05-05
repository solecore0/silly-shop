// src/redux/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import toast from "react-hot-toast";

// Async thunks for fetching data from backend
export const fetchProductInfo = createAsyncThunk(
  "product/fetchProductInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/product/latest");
      return response.data.products;
    } catch (error) {
      // toast.error(error.response?.data?.message || "Failed to fetch products");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchProductSearch = createAsyncThunk(
  "product/fetchProductSearch",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/find?name=${query}`);
      return response.data.products;
    } catch (error) {
      // toast.error(error.response?.data?.message || "Search failed");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchProductId = createAsyncThunk(
  "product/fetchProductId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data.product;
    } catch (error) {
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch product details"
      // );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "product/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/product/categories");
      return response.data.categories;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/product/all");
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
      const response = await api.post("/product/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
  reducers: {},
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
          state.error = action.payload || action.error.message;
          // Show error toast for any rejected action
          // toast.error(state.error);
        }
      );
  },
});

export default productSlice.reducer;
