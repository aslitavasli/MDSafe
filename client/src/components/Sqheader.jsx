import { BrowserRouter, Link } from "react-router-dom";
import Logout from './Logout';
import medSafeLogo from './img/MedSafe.png';

function Sqheader() {
  return (
    <header
      style={{
        backgroundColor: "#b71c1c", // Dark red
        color: "white",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Poppins', sans-serif", // Applying Poppins font
      }}
    >
      {/* Logo and Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img 
          src={medSafeLogo} 
          alt="MedSafe Logo" 
          style={{ width: "40px", height: "40px", borderRadius: "50%" }} 
        />
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>MedSafe</h1>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link 
          to="/" 
          style={{ 
            color: "white", 
            textDecoration: "none", 
            fontWeight: "bold", 
            fontSize: "16px",
            borderBottom: "2px solid transparent",
            paddingBottom: "2px"
          }}
          onMouseEnter={(e) => e.target.style.borderBottom = "2px solid white"}
          onMouseLeave={(e) => e.target.style.borderBottom = "2px solid transparent"}
        >
          Dashboard
        </Link>
        <Logout />
      </nav>
    </header>
  );
}

export default Sqheader;
