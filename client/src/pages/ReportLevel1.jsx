import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './styles.css'; // Import the custom CSS file

export default function ReportLevel1() {
  const [location, setLocation] = useState("");

  async function handleReport(level) {
    try {
      const response = await axios.post(`/report/${level}`, { location });
      console.log("Report handled successfully:", response.data);
    } catch (error) {
      console.error("Error handling report:", error);
    }
  }

  async function handleCancel(){
    try {
      const level = 1;
      const response = await axios.delete(`/cancelreport`, { data: { level } });
      console.log("Cancelled successfully:", response.data);
    } catch (error) {
      console.error("Error handling cancel:", error);
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 custom-title">Report Level 1</h2>

      <div className="row mb-4">
        <div className="col-sm-4">
          <DashboardTile
            name="L2"
            id="reportlevel2"
            description="Report 2"
            onClick={() => handleReport(2)}
          />
        </div>
        <div className="col-sm-4">
          <DashboardTile
            name="L3"
            id="reportlevel3"
            description="Report 3"
            onClick={() => handleReport(3)}
          />
        </div>
        <div className="col-sm-4">
          <DashboardTile
            name="Cancel..."
            id="/"
            description="Mistake? Cancel now"
            onClick={() => handleCancel()}
          />
        </div>
      </div>

      <h4 className="text-center mb-3 custom-subtitle">Different Location?</h4>
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control custom-input"
          placeholder={location || "Enter name..."} // Dynamic placeholder
          value={location}
          onChange={(e) => setLocation(e.target.value)} // Update location state
          required
        />
      </div>
    </div>
  );
}

function DashboardTile({ name, id, description, onClick }) {
  return (
    <div
      className="card shadow-lg mb-3 custom-card"
      style={{ cursor: "pointer" }}
      onClick={onClick} // Pass click event to parent
    >
      <div className="card-body text-center">
        <Link to={`../${id}`} className="text-decoration-none text-dark">
          <h5 className="card-title custom-card-title">{name}</h5>
          <p className="card-text custom-card-text">{description}</p>
        </Link>
      </div>
    </div>
  );
}
