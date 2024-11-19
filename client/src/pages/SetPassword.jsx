import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import './SetPassword.css';
import { useNavigate } from "react-router-dom";

const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Extract token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      // Make request to backend to set the new password
      const response = await axios.post('/setpassword', {
        token,
        password,
      });

      if (response.status === 200) {
        setMessage("Your password has been successfully set. You can now log in.");

        navigate('/login')

      } else {
        setError(response.data.message || "An error occurred, please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred, please try again.");
    }
  };

  return (
    <div className="set-password-container">
      <div className="form-wrapper">
        <h2 className="form-title">Set Your Password</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              New Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
