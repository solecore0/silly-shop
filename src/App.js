import React, { lazy, Suspense, useEffect ,useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch , useSelector } from "react-redux";
import { setScreenWidth } from "./redux/uiSlice";
import { fetchProductInfo } from "./redux/product";
import Cookies from 'js-cookie';

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
    const token = localStorage.getItem('token');
    
     if (token ) {
    // prevent future runs
    dispatch(loadUser());
  }

    // Load initial data
    dispatch(fetchProductInfo());

    

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch ]);

  return (
    <Router>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductInfo />} />
          <Route path="/OrderInformation" element={<OrderInformation />} />
          <Route path="/order" element={<Order />} />
          {/* Admin  */}
          <Route path="/admin/dashboard" element={<DashBoard />} />
          <Route path="/admin/product" element={<Products />} />
          <Route path="/admin/customer" element={<Customer />} />
          <Route path="/admin/transaction" element={<Transaction />} />
          <Route path="/admin/chart/line" element={<LineChart />} />
          <Route path="/admin/chart/pie" element={<PieChart />} />
          <Route path="/admin/chart/bar" element={<BarChart />} />
          <Route path="/admin/app/coupon" element={<Coupon />} />
          <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
          <Route path="/admin/app/toss" element={<Toss />} />
          <Route path="/admin/AddProduct" element={<AddProduct/>}></Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
