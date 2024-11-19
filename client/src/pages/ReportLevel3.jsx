import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './styles.css'; // Import shared CSS

export default function ReportLevel3() {
  const [location, setLocation] = useState("");

  // Function to handle report submission
  async function handleReport(level) {
    try {
      const response = await axios.post(`/report/${level}`, { location });
      console.log("Report handled successfully:", response.data);
    } catch (error) {
      console.error("Error handling report:", error);
    }
  }

  // Function to handle cancelation of report
  async function handleCancel() {
    try {
      const level = 3;
      const response = await axios.delete(`/cancelreport`, { data: { level } });
      console.log("Cancelled successfully:", response.data);
    } catch (error) {
      console.error("Error handling cancel:", error);
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 custom-title">You have reported Level 3... </h2>
      <h3 className="text-center mb-4 custom-subtitle">Law enforcement will be here momentarily.</h3>


      <div className="row mb-4 g-3">
        {/* Report level tiles */}
        <div className="col-12">
          <DashboardTile
            name="Cancel"
            id="/"
            description="Mistake? Cancel now."
            className="tile-blue"
            onClick={() => handleCancel()}
          />
        </div>
      </div>

      {/* Location input */}
      <h4 className="text-center mb-4 custom-title">Different Location?</h4>
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control custom-input"
          placeholder={location || "Enter current location..."}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
    </div>
  );
}

// DashboardTile component for creating each clickable tile
function DashboardTile({ name, id, description, onClick, className }) {
  return (
    <div
      className={`card shadow-lg mb-3 custom-card ${className}`}
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
