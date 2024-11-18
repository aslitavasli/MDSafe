import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

export default function ReportLevel2() {
  const [location, setLocation] = useState("");

  async function handleReport(level) {
    try {
      const response = await axios.post(`/report/${level}`, { location });
      console.log("Report handled successfully:", response.data);
    } catch (error) {
      console.error("Error handling report:", error);
    }
  }

  return (
    <div>
      <h2>LEVEL 2 pressed....</h2>

      <DashboardTile
        name="L3"
        id="reportlevel3"
        description="Report 3"
        onClick={() => handleReport(3)}
      />

      <DashboardTile
        name="Cancel..."
        id="cancelreport"
        description="Mistake? Cancel now"
        onClick={() => handleReport("cancel")}
      />

      <h1>Different Location?</h1>
      <input
        type="text"
        placeholder={location || "Enter name..."} // Dynamic placeholder
        value={location}
        onChange={(e) => setLocation(e.target.value)} // Update location state
        required
        style={{
          width: '100%',
          padding: '8px',
          marginTop: '5px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
}

function DashboardTile({ name, id, description, onClick }) {
  return (
    <div
      className="dashboardTile"
      style={{
        display: "inline-block",
        background: "lightblue",
        border: "1px solid black",
        padding: "20px",
        margin: "5px",
        width: "150px",
        cursor: "pointer",
      }}
      onClick={onClick} // Pass click event to parent
    >
      <Link to={`../${id}`}>
        <h4 style={{ textAlign: "center" }}>{name}</h4>
        <p>{description}</p>
      </Link>
    </div>
  );
}
