import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './FeedbackButton.css';

function Dashboard() {
  const [adminData, setAdminData] = useState(null);
  const [location, setLocation] = useState(""); // State for location input
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const response = await axios.get("/dashboard");
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } 
    }

    fetchAdminData();
  }, []); // Empty dependency array ensures this runs once on mount

  async function handleReport(level) {
    try {
      const response = await axios.post(`/report/${level}`, { location });
      console.log("Report handled successfully:", response.data);
    } catch (error) {
      console.error("Error handling report:", error);
    }
  }

  function openFeedbackForm(){
    navigate('/submitfeedback')
  }

  return (
    <div>
      {adminData?.admin && ( // Show admin tiles if user is an admin
        <>
       <div className="container mt-5">
  <h2 className="text-center mb-4 custom-title">Dashboard </h2>
  <div className="row">
    <div className="col-md-4">
      <DashboardTile
        name="View Feedback"
        image="managefloors.png"
        id="viewfeedback"
        description="View feedback from employees."
        className="tile-red"
      />
    </div>
    <div className="col-md-4">
      <DashboardTile
        name="Edit Users"
        image="managefloors.png"
        id="editusers"
        description="View, add, edit, and remove users."
        className="tile-red"
      />
    </div>
    <div className="col-md-4">
      <DashboardTile
        name="Previous Incidents"
        image="managefloors.png"
        id="viewreports"
        description="See current and previous reports."
        className="tile-red"
      />
    </div>
  </div>
</div>
        </>
      )}

      {!adminData?.admin && ( // Show user tiles if not an admin
        <>
         <div className="container mt-5">
         <h2 className="text-center mb-4 custom-title">Report </h2>
         

          <div className="row mb-4 g-3">
          <div className="col-12">
          <DashboardTile
            name="L1"
            image="managefloors.png"
            id="reportlevel1"
            description="Feeling unsafe, have a guard nearby."
            className="tile-red"
            onClick={() => handleReport(1)}
          />
           </div>

           <div className="col-12">
          <DashboardTile
            name="L2"
            image="managefloors.png"
            id="reportlevel2"
            description="Call local security."
            className="tile-green"
            onClick={() => handleReport(2)}
          />
           </div>
          <div className="col-12">
          <DashboardTile
            name="L3"
            image="managefloors.png"
            id="reportlevel3"
            description="Call local security and law enforcement."
            className="tile-blue"
            onClick={() => handleReport(3)}
          />
          </div>
          </div>
          </div>

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

<div className="feedback-button-container">
            <button className="feedback-button" onClick={openFeedbackForm}>
                Share Feedback
            </button>
        </div>


        </>
      )}
    </div>
  );

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
}

export default Dashboard;
