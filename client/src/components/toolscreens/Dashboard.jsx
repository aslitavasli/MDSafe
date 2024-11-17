import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [adminData, setAdminData] = useState(null);


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

  // If data is loading, you can display a loading state
 
console.log(adminData)
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="dashboardTile">
        <DashboardTile
          name="Manage floors"
          image="newfloor.png"
          id="floors"
          description="Create, modify and delete floors"
        />
        <DashboardTile
          name="Manage shelves"
          image="managefloors.png"
          id="manageshelves"
          description="Create, modify and delete shelves"
        />
        <DashboardTile
          name="Manage range values"
          image="managefloors.png"
          id="floors"
          description="Assign call number ranges to specific shelves"
        />
        <DashboardTile
          name="View maps"
          image="managefloors.png"
          id="floors"
          description="View floor maps and look up a book"
        />

        {adminData?.admin && ( // Show admin tiles if user is an admin
          <>
            <DashboardTile
              name="Admin panel"
              image="managefloors.png"
              id="admin"
              description="Only admins can see this tile."
            />
            <DashboardTile
              name="Edit users"
              image="managefloors.png"
              id="editusers"
              description="Only admins can see this tile."
            />
            <DashboardTile
              name="Register new user"
              image="managefloors.png"
              id="registerusers"
              description="Only admins can see this tile."
            />
          </>
        )}
      </div>
    </div>
  );

  function DashboardTile({ name, image, id, description }) {
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
        onClick={() => {
          // setToShow(id)
          // navigate(id);
        }}
      >
        <Link to={`${id}`}>
          {/* <img src={image} style={{ width: "150px" }} /> */}
          <h4 style={{ textAlign: "center" }}>{name}</h4>
          <p>{description}</p>
        </Link>
      </div>
    );
  }
}

export default Dashboard;
