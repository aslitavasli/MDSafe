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
          <h1>Dashboard</h1>
          <DashboardTile
            name="View Feedback"
            image="managefloors.png"
            id="viewfeedback"
            description="Only admins can see this tile."         
          />
          <DashboardTile
            name="Edit Users"
            image="managefloors.png"
            id="editusers"
            description="Only admins can see this tile."
          />
          <DashboardTile
            name="Previous Incidents"
            image="managefloors.png"
            id="viewreports"
            description="Only admins can see this tile."
         
          />
        </>
      )}

      {!adminData?.admin && ( // Show user tiles if not an admin
        <>
          <h1>Report</h1>
          <DashboardTile
            name="L1"
            image="managefloors.png"
            id="reportlevel1"
            description="Report 1"
            onClick={() => handleReport(1)}
          />
          <DashboardTile
            name="L2"
            image="managefloors.png"
            id="reportlevel2"
            description="Report 2"
            onClick={() => handleReport(2)}
          />
          <DashboardTile
            name="L3"
            image="managefloors.png"
            id="reportlevel3"
            description="Report 3"
            onClick={() => handleReport(3)}
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

<div className="feedback-button-container">
            <button className="feedback-button" onClick={openFeedbackForm}>
                Share Feedback
            </button>
        </div>


        </>
      )}
    </div>
  );

  function DashboardTile({ name, image, id, description, onClick }) {
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
        }}
        onClick={onClick} // Pass click event to parent
      >
        <Link to={`${id}/`}>
          <h4 style={{ textAlign: "center" }}>{name}</h4>
          <p>{description}</p>
        </Link>
      </div>
    );
  }
}

export default Dashboard;
