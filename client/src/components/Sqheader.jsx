import { BrowserRouter, Link } from "react-router-dom";
import Logout from './Logout'

function Sqheader() {
  return (
    <header
      style={{
        backgroundColor: "#5E3023",
        color: "#fff !important",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "white" }}>MedSafe</h1>
      <Link to="/">Dashboard</Link>
      <Logout/>
    </header>
  );
}

export default Sqheader;
