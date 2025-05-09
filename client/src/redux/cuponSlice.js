import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import {toast} from "react-toastify";


export const createCupon = createAsyncThunk(
    "cupon/createCupon",
    async (couponData, {  rejectWithValue }) => {
      try {
        const response = await api.post("/payment/coupon/new", couponData);
        toast.success("Cupon created successfully!");
        return response.data;
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create cupon");
        return rejectWithValue(error.response?.data?.message);
      }
    }
  );

 export const fetchAllCupons = createAsyncThunk(
   "cupon/fetchAllCupons",
   async (_, { rejectWithValue }) => {
     try {
       const response = await api.get("/payment/coupon/all");
       return response.data.coupons;
     } catch (error) {
       toast.error(
         error.response?.data?.message || "Failed to fetch all cupons"
       );
       return rejectWithValue(error.response?.data?.message);
     }
   }
 ) 

export const deleteCupon = createAsyncThunk(
  "cupon/deleteCupon",
  async (cuponId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/payment/coupon/${cuponId}`);
      toast.success("Cupon deleted successfully!");
      return response.data;   
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete cupon");
      return rejectWithValue(error.response?.data?.message);
    }
  }
)

const cuponSlice = createSlice({
  name: "cupon",
  initialState: {
    cupons: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCupon.pending, (state) => {
        state.error = null;
      })
      .addCase(createCupon.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(createCupon.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchAllCupons.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchAllCupons.fulfilled, (state, action) => {
        state.cupons = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCupons.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteCupon.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteCupon.fulfilled, (state, action) => {
        state.error = null;
        state.cupons = state.cupons.filter((cupon) => cupon._id !== action.meta.arg);
      })
      .addCase(deleteCupon.rejected, (state, action) => {
        state.error = action.payload;
      })

  }
});


export default cuponSlice.reducer;
