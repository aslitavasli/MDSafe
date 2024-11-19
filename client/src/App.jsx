import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext";
import EditUsers from "./pages/UserDashboard";
import RegisterHospitalSystem from "./pages/RegisterHospitalSystem";
import Logout from './components/Logout.jsx';
import ReactDOM from "react-dom";
import SetPassword from "./pages/SetPassword.jsx";
import ViewReports from "./pages/ViewReports.jsx";
import ReportLevel1 from "./pages/ReportLevel1.jsx";
import ReportLevel2 from "./pages/ReportLevel2.jsx";
import ReportLevel3 from "./pages/ReportLevel3.jsx";
import Sqheader from "./components/Sqheader.jsx";
import Dashboard from "./components/toolscreens/Dashboard.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import FeedbackForm from "./pages/Feedback.jsx";
import ViewFeedback from "./pages/ViewFeedback.jsx";


axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const App = () => {
  const location = useLocation();

  // Check if we are on login or register pages
  const isLoginPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <UserContextProvider>
      {/* Conditionally render Sqheader based on current path */}
      {!isLoginPage && <Sqheader />}
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="App">
        <div
          id="toShowContainer"
          style={{
            marginLeft: "5%",
            marginRight: "5%",
            background: "gray",
            padding: "20px",
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/editusers" element={<EditUsers />} />
            <Route path="/registerusers" element={<Register />} />
            <Route path="/setpassword/" element={<SetPassword />} />
            <Route path = "/reportlevel1/" element = {<ReportLevel1 />} />
            <Route path = "/reportlevel2/" element = {<ReportLevel2 />} />
            <Route path = "/reportlevel3/" element = {<ReportLevel3 />} />
            <Route path="/registerhospitalsystem"
              element={<RegisterHospitalSystem />}
            />
            <Route path= "/viewreports" element={<ViewReports /> }/>
            <Route path= "/submitfeedback" element={<FeedbackForm /> }/>
            <Route path = "viewfeedback" element={<ViewFeedback />}/>
          </Routes>
        </div>
      </div>
    </UserContextProvider>
  );
};

export default App;
