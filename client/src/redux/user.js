import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const COOKIE_EXPIRES = 7;

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        {
          email,
          password,
        }
      );

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  "user/signup",
  async (
    { name, email, password, photo, dob, gender },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        {
          name,
          email,
          password,
          gender,
          dob,
          photo,
        }
      );

      // Store token in localStorage immediately on success
      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for loading user data
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("token");
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        Cookies.set("token", action.payload.token, { expires: COOKIE_EXPIRES });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        // Set cookie on successful signup
        Cookies.set("token", action.payload.token, { expires: COOKIE_EXPIRES });
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load user cases
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
