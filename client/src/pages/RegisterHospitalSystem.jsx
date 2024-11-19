import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterHospitalSystem() {
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    institutionName: "",
    institutionEmail: "",
  });

  const [errors, setErrors] = useState({
    institutionName: "",
    institutionEmail: "",
  });

  const registerHospitalSystem = async (e) => {
    e.preventDefault();
    const { institutionName, institutionEmail } = data;

    // Simple validation before submitting
    if (!institutionName || !institutionEmail) {
      setErrors({
        institutionName: institutionName ? "" : "Institution name is required",
        institutionEmail: institutionEmail ? "" : "Email is required",
      });
      return;
    }

    try {
      const { data } = await axios.post("/registerhospitalsystem", {
        institutionName,
        institutionEmail,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success("System registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg" style={{ width: "100%", maxWidth: "500px", borderRadius: "10px" }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Register Hospital System</h5>
          <form onSubmit={registerHospitalSystem}>
            <div className="mb-3">
              <label className="form-label">Institution Name</label>
              <input
                type="text"
                className={`form-control ${errors.institutionName ? "is-invalid" : ""}`}
                placeholder="Enter institution name..."
                value={data.institutionName}
                onChange={(e) => {
                  setData({ ...data, institutionName: e.target.value });
                  setErrors({ ...errors, institutionName: "" }); // Clear error on input change
                }}
              />
              {errors.institutionName && <div className="invalid-feedback">{errors.institutionName}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Institutional Email</label>
              <input
                type="email"
                className={`form-control ${errors.institutionEmail ? "is-invalid" : ""}`}
                placeholder="Enter institutional email..."
                value={data.institutionEmail}
                onChange={(e) => {
                  setData({ ...data, institutionEmail: e.target.value });
                  setErrors({ ...errors, institutionEmail: "" }); // Clear error on input change
                }}
              />
              {errors.institutionEmail && <div className="invalid-feedback">{errors.institutionEmail}</div>}
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary btn-lg" style={{ transition: "background-color 0.3s" }}>
                Register Hospital System
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
