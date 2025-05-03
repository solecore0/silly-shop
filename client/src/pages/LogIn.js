import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/user";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async() => {
    await dispatch(loginUser({ email, password }));
     if (localStorage.getItem('token')) {
          navigate('/')
        }
  };

  return (
    <div className="registery">
      <h1>Log-In</h1>

      <div className="inp">
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Log-In</button>
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
