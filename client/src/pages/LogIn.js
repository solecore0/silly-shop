import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/user";
import { useNavigate } from "react-router-dom";
import { toast }from 'react-toastify';

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    if (token && user) {
      navigate("/");
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if (result.token) {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="registery" onKeyDown={handleKeyDown}>
      <h1>Log-In</h1>
      {/* {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "10px" }}
        >
          {error}
        </div>
      )} */}
      <div className="inp">
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            opacity: 1,
          }}
        >
          {/* {loading ? (
            <>
              <div
                className="loader"
                style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid #f3f3f3",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginRight: "8px",
                }}
              ></div>
              Logging in...
            </>
          ) : (
            "Log-In"
          )} */}
          Log-In
        </button>
      </div>
      <hr />
      <div className="sin">
        <p>Don't have an account</p>
        <Link to="/signup">Sign-Up.</Link>
      </div>
    </div>
  );
};

export default LogIn;
