import React, { lazy, Suspense, useEffect, useRef } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setScreenWidth } from "./redux/uiSlice";
import { fetchProductInfo } from "./redux/product";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

// css
import "./App.css";
import "./css/tablet.css";
import "./css/laptop.css";

// components
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import { loadUser } from "./redux/user";
import { current } from "@reduxjs/toolkit";

// pages
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductInfo = lazy(() => import("./pages/ProductInfo"));
const LogIn = lazy(() => import("./pages/LogIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const OrderInformation = lazy(() => import("./pages/OrderInformation"));
const Order = lazy(() => import("./pages/Order"));
// Admin imports
const DashBoard = lazy(() => import("./pages/admin/DashBoard"));
const Products = lazy(() => import("./pages/admin/Products"));
const Customer = lazy(() => import("./pages/admin/Customer"));
const Transaction = lazy(() => import("./pages/admin/Transaction"));
const LineChart = lazy(() => import("./pages/admin/charts/LineCharts"));
const PieChart = lazy(() => import("./pages/admin/charts/PieCharts"));
const BarChart = lazy(() => import("./pages/admin/charts/BarCharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));

// Private Route Component
const PrivateRoute = ({ element, adminRequired = false }) => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  console.log("PrivateRoute check:", {
    hasUser: !!user,
    hasToken: !!token,
    userRole: user?.role,
    adminRequired,
    isAdmin: user?.role === "admin",
  });

  if (!token || !user) {
    console.log("No token or user, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (adminRequired && user.role !== "admin") {
    console.log("Admin access denied, redirecting to home");
    return <Navigate to="/" />;
  }

  return element;
};

function App() {
  const dispatch = useDispatch();

  const hasFetchedUser = useRef(false);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      dispatch(setScreenWidth(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial dispatch

    // Check for authentication token

    const token = localStorage.getItem("token");

    if (token) {
      // prevent future runs
      dispatch(loadUser());
    }

    // Load initial data
    dispatch(fetchProductInfo());

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
          style: {
            background: "#333",
            color: "#fff",
          },
          // Add close button configuration
          success: {
            duration: 3000,
            icon: "✅",
            className: "toast-success",
          },
          error: {
            duration: 4000,
            icon: "❌",
            className: "toast-error",
          },
          // Enable close button for all toasts
          closeButton: true,
        }}
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductInfo />} />
          <Route
            path="/OrderInformation"
            element={<PrivateRoute element={<OrderInformation />} />}
          />
          <Route path="/order" element={<PrivateRoute element={<Order />} />} />
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute adminRequired={true} element={<DashBoard />} />
            }
          />
          <Route
            path="/admin/product"
            element={
              <PrivateRoute adminRequired={true} element={<Products />} />
            }
          />
          <Route
            path="/admin/customer"
            element={
              <PrivateRoute adminRequired={true} element={<Customer />} />
            }
          />
          <Route
            path="/admin/transaction"
            element={
              <PrivateRoute adminRequired={true} element={<Transaction />} />
            }
          />
          <Route
            path="/admin/chart/line"
            element={
              <PrivateRoute adminRequired={true} element={<LineChart />} />
            }
          />
          <Route
            path="/admin/chart/pie"
            element={
              <PrivateRoute adminRequired={true} element={<PieChart />} />
            }
          />
          <Route
            path="/admin/chart/bar"
            element={
              <PrivateRoute adminRequired={true} element={<BarChart />} />
            }
          />
          <Route
            path="/admin/app/coupon"
            element={<PrivateRoute adminRequired={true} element={<Coupon />} />}
          />
          <Route
            path="/admin/app/stopwatch"
            element={
              <PrivateRoute adminRequired={true} element={<Stopwatch />} />
            }
          />
          <Route
            path="/admin/app/toss"
            element={<PrivateRoute adminRequired={true} element={<Toss />} />}
          />
          <Route
            path="/admin/AddProduct"
            element={
              <PrivateRoute adminRequired={true} element={<AddProduct />} />
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
