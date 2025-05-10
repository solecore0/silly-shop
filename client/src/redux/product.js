// src/redux/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { toast } from "react-toastify";

// Async thunks for fetching data from backend
export const fetchProductInfo = createAsyncThunk(
  "product/fetchProductInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/product/latest");
      return response.data.products;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchProductSearch = createAsyncThunk(
  "product/fetchProductSearch",
  async (tableData, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/product/find?query=${tableData.query}&sort=${tableData.sort}&category=${tableData.category}&price=${tableData.price}`
      );
      return response.data.products;
    } catch (error) {
      toast.error(error.response?.data?.message || "Search failed");
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
      toast(error.response?.data?.message || "Failed to fetch product details");
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
      toast.error(error.response?.data?.message || "Failed to fetch products");
      return rejectWithValue(error.response?.data?.message);
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
      toast.success("Product created successfully");
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createReview = createAsyncThunk(
  "product/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post("/product/review", reviewData);
      toast.success("Review added successfully");
      return response.data.product;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add review");
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/product/${productId}`);
      toast.success("Product deleted successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    productInfo: [],
    productSearch: [],
    productId: null,
    categories: [],
    allProducts: [],
    query: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productInfo = action.payload;
      })
      .addCase(fetchProductSearch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductSearch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productSearch = action.payload;
      })
      .addCase(fetchProductId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productId = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allProducts = action.payload || [];
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allProducts.push(action.payload);
        state.productSearch.push(action.payload);
        state.productInfo = push(action.payload);
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.productInfo.reviews.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.allProducts = state.allProducts.filter(
          (product) => product._id !== action.payload._id
        );
        state.productSearch = state.productSearch.filter(
          (product) => product._id !== action.payload._id
        );
        state.productInfo = state.productInfo.filter(
          (product) => product._id !== action.payload._id
        );
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message;
          toast.error(state.error);
        }
      );

  },
});

export const { setQuery } = productSlice.actions;

export default productSlice.reducer;
