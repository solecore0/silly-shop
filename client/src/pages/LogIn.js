import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/user";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if (result.token) {
        navigate("/");
        window.location.reload();
      }
    } catch (err) {
      console.error("Login failed:", err);
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
      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "10px" }}
        >
          {error}
        </div>
      )}
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
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
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
          )}
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
