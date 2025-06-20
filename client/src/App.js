import React, { lazy, Suspense, useEffect, useRef, useState } from "react";

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
import { ToastContainer, toast } from "react-toastify";

// css
import "./App.css";
import "./css/tablet.css";
import "./css/laptop.css";
import "./css/desktop.css";

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
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
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
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));

// Private Route Component
const PrivateRoute = ({ element, adminRequired = false }) => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (adminRequired && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return element;
};

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      dispatch(setScreenWidth(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial dispatch

    // Check for authentication token
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await dispatch(loadUser()).unwrap();
        }
      } catch (error) {
        localStorage.removeItem("token"); // Clear invalid token
      } finally {
        setIsLoading(false); // Always set loading to false
      }
    };

    initializeAuth();
    dispatch(fetchProductInfo());

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        limit={3}
        style={{ zIndex: "9999", top: "60px" }}
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
          <Route
            path="/order/:id"
            element={<PrivateRoute element={<OrderDetails />} />}
          />
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
