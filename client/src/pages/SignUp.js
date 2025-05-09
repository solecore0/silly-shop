import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const url = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(url);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

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

    // Add validation
    if (!name || !email || !password || !dob || !gender) {
      toast.error("Please fill in all fields");
      return;
    }

    if (name.length < 4) {
      toast.error("Username must be at least 4 characters long");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await dispatch(
        signupUser({ name, password, email, photo, dob, gender })
      ).unwrap();
      if (result.token) {
        navigate("/");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  console.log(name, password, email, photo, dob, gender);
  return (
    <div className="registery" onKeyDown={handleKeyDown}>
      <h1>Sign-up</h1>
      <div className="inp">
        <input
          type="text"
          value={name}
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
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
        {/* <input
          type="url"
          value={photo}
          placeholder="Profile-Pic"
          onChange={(e) => setPhoto(e.target.value)}
        /> */}
        <input
          type="date"
          value={dob}
          placeholder="Birthday"
          onChange={(e) => setDob(e.target.value)}
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="gender-select"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
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
              Signing up...
            </>
          ) : (
            "Sign up"
          )}
        </button>
      </div>
      <hr />
      <div className="sin">
        <p>Already have an account ?</p>
        <Link to="/login">Log In</Link>
      </div>
    </div>
  );
};

export default SignUp;
