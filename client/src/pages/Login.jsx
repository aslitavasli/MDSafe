import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    // Simple validation before submitting
    if (!email || !password) {
      setErrors({
        email: email ? "" : "Email is required",
        password: password ? "" : "Password is required",
      });
      return;
    }

    try {
      const { data } = await axios.post("/login", { email, password });

      if (data.error) {
        toast.error(data.error);
      } else {
        setData({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div
    className="d-flex justify-content-center align-items-center min-vh-100"
    style={{ backgroundColor: "" }} // Add this line for red background
  >
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg" style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Login</h5>
          <form onSubmit={loginUser}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter institutional email..."
                value={data.email}
                onChange={(e) => {
                  setData({ ...data, email: e.target.value });
                  setErrors({ ...errors, email: '' }); // Clear error on input change
                }}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password..."
                value={data.password}
                onChange={(e) => {
                  setData({ ...data, password: e.target.value });
                  setErrors({ ...errors, password: '' }); // Clear error on input change
                }}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary btn-lg" style={{ transition: "background-color 0.3s" }}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}
