import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create async thunk for fetching pie chart data
export const fetchPieData = createAsyncThunk(
  'charts/fetchPieData',
  async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/v1/admin/stats/pie', {
        headers: {
            Authorization: `Bearer ${token}`
          }
    });
      return response.data.charts;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Add line chart data thunk
export const fetchLineData = createAsyncThunk(
    'charts/fetchLineData',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/v1/admin/stats/Line', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data.charts;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );

// Add bar chart data thunk
export const fetchBarData = createAsyncThunk(
    'charts/fetchBarData',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/v1/admin/stats/bar', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data.charts;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );

const chartsSlice = createSlice({
  name: 'charts',
  initialState: {
    pieData: [],
    barData: [],
    lineData: [],
    loading: false,
    error: null
  },
  reducers: {
    clearChartError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
    // Pie chart cases
    .addCase(fetchPieData.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchPieData.fulfilled, (state, action) => {
      state.loading = false;
      state.pieData = action.payload;
    })
    .addCase(fetchPieData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Bar chart cases
    .addCase(fetchBarData.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchBarData.fulfilled, (state, action) => {
      state.loading = false;
      state.barData = action.payload;
    })
    .addCase(fetchBarData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Line chart cases
    .addCase(fetchLineData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLineData.fulfilled, (state, action) => {
        state.loading = false;
        state.lineData = action.payload;
      })
      .addCase(fetchLineData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export const { clearChartError } = chartsSlice.actions;
export default chartsSlice.reducer;