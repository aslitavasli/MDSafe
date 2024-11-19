import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './styles.css'; // Import custom CSS

export default function ReportLevel1() {
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
      const level = 1;
      const response = await axios.delete(`/cancelreport`, { data: { level } });
      console.log("Cancelled successfully:", response.data);
    } catch (error) {
      console.error("Error handling cancel:", error);
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 custom-title">You have reported Level 1... </h2>
      <h3 className="text-center mb-4 custom-subtitle">A guard will be nearby.</h3>

      <div className="row mb-4 g-3">
  {/* Report level tiles */}
  <div className="col-12">
    <DashboardTile
      name="L2"
      id="reportlevel2"
      description="Call local security."
      className="tile-red"
      onClick={() => handleReport(2)}
    />
  </div>
  <div className="col-12">
    <DashboardTile
      name="L3"
      id="reportlevel3"
      description="Call local security and law enforcement."
      className="tile-green"
      onClick={() => handleReport(3)}
    />
  </div>
  <div className="col-12">
    <DashboardTile
      name="Cancel"
      id="/"
      description="Accidental click, cancel."
      className="tile-blue"
      onClick={() => handleCancel()}
    />
  </div>
</div>


      {/* Location input */}
     
      <div className="container mt-5">
      <h4 className="text-center mb-4 custom-title">Different Location?</h4>
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

