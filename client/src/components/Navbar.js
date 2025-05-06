import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleNav, toggleoffAdmin, toggleonAdmin } from "../redux/adminNav";
import { fetchProductSearch } from "../redux/product";
import { logout } from "../redux/user";
import { current } from "@reduxjs/toolkit";

function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();

  let b = "fa-bars";

  let a = "fa-bars-staggered";

  const [t, setT] = useState(b);

  const [openNav, setOpenNav] = useState(false);

  const [openUsr, setOpenUsr] = useState(false);

  const admin = useSelector((state) => state.adminNav.admin);

  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const toggleNavigation = () => {
    if (t === a) {
      setT(b);
      setOpenNav(false);
      setOpenUsr(false);
    } else {
      setT(a);
      setOpenNav(true);
      setOpenUsr(false);
    }
  };

  const toggleUser = () => {
    if (openUsr) {
      setT(b);
      setOpenUsr(false);
      setOpenNav(false);
    } else {
      setT(b);
      setOpenUsr(true);
      setOpenNav(false);
    }
  };

  const handleAdminNav = () => {
    dispatch(toggleNav());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search`);
  };

  const logOut = () => {
    dispatch(logout());
    setOpenUsr(false);
    navigate("/");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchProductSearch(query));
    if (location.pathname.includes("admin")) {
      dispatch(toggleonAdmin());
    } else {
      dispatch(toggleoffAdmin());
    }
  }, [location.pathname, query]);

  const screenWidth = useSelector((state) => state.ui.screenWidth);

  const user = useSelector((state) => state.user.user);

  if (screenWidth > 750 && screenWidth < 1000) {
    return (
      <>
        <div className="navbar">
          <h1
            onClick={() => {
              navigate("/");
            }}>
            Silly-Shop
          </h1>
          <div className="links">
            <ul>
              <li>
                <Link to="/">
                  <i className="fa-solid fa-home"></i>
                </Link>
              </li>
              <li>
                <Link to="/cart">
                  <i className="fa-solid fa-cart-shopping"></i>
                </Link>
              </li>
              <li>
                <Link to="/search">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </Link>
              </li>
              {user ? (
                <li>
                  <img
                    src={user?.photo}
                    alt={user?.name?.[0] || "U"}
                    onClick={toggleUser}
                  />
                </li>
              ) : (
                <li>
                  <Link to="/login">Log-in</Link>{" "}
                </li>
              )}
              {admin ? (
                <li>
                  <i
                    className="fa-solid fa-ellipsis-vertical"
                    onClick={handleAdminNav}></i>
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
        </div>
        {openUsr ? (
          <div className={`Tlinks`}>
            <ul>
              {user?.role === "admin" && (
                <li>
                  <Link to="/admin/dashboard">Admin</Link>
                </li>
              )}
              <li>
                <a onClick={logOut}>Log Off</a>
              </li>
              <li>
                <Link to="/order">Orders</Link>
              </li>
            </ul>
          </div>
        ) : null}
      </>
    );
  } else if (screenWidth > 1000) {
    return (
      <>
        <div className="navbar">
          <div>
            <h1
              onClick={() => {
                navigate("/");
              }}>
              Silly-Shop
            </h1>
          </div>
          <div className="ser">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              onClick={(e) => {
                handleSearch(e);
              }}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Search by name..."
            />
          </div>
          <div className="links">
            <ul>
              <li>
                <Link to="/">
                  <i className="fa-solid fa-home"></i>
                </Link>
              </li>
              <li>
                <Link to="/cart">
                  <i className="fa-solid fa-cart-shopping"></i>
                </Link>
              </li>
              {user ? (
                <img
                  src={user?.photo}
                  alt={user?.name?.[0] || "U"}
                  onClick={toggleUser}
                />
              ) : (
                <li>
                  <Link to="/login">Log-in</Link>{" "}
                </li>
              )}
            </ul>
          </div>
        </div>
        {openUsr ? (
          <div className={`Llinks`}>
            <ul>
              <li>
                <Link to="/order">Orders</Link>
              </li>
              {user?.role === "admin" && (
                <li>
                  <Link to="/admin/dashboard">Admin</Link>
                </li>
              )}
              <li>
                <a onClick={logOut}>Log Off</a>
              </li>
            </ul>
          </div>
        ) : null}
      </>
    );
  } else {
    return (
      <>
        <div className="navbar">
          <div className="head">
            <i className={`fa-solid ${t}`} onClick={toggleNavigation}></i>
            <h1
              onClick={() => {
                navigate("/");
              }}>
              Silly-Shop
            </h1>
          </div>
          <div className="Adm">
            {user ? (
              <img
                src={user?.photo}
                alt={user?.name?.[0] || "U"}
                onClick={toggleUser}
              />
            ) : (
              <Link to="/login">Log-in</Link>
            )}
            {admin ? (
              <i
                className="fa-solid fa-ellipsis-vertical"
                onClick={handleAdminNav}></i>
            ) : (
              ""
            )}
          </div>
        </div>
        {openNav ? (
          <div className={`links`}>
            <ul>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li>
                <Link to="/search">Search</Link>
              </li>
              <li>
                <Link to="/order">Orders</Link>
              </li>
            </ul>
          </div>
        ) : null}
        {openUsr ? (
          <div className={`Llinks`}>
            <ul>
              {user?.role === "admin" && (
                <li>
                  <Link to="/admin/dashboard">Admin</Link>
                </li>
              )}
              <li>
                <a onClick={logOut}>Log Off</a>
              </li>
            </ul>
          </div>
        ) : null}
      </>
    );
  }
}

export default Navbar;
