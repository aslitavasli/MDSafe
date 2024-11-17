import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
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
        password
      });

      if (response.status === 200) {
        setMessage("Your password has been successfully set. You can now log in.");
      } else {
        setError(response.data.message || "An error occurred, please try again.");
      }

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred, please try again.");
    }
  };

  return (
    <div className="set-password-container">
      <h2>Set Your Password</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Set Password</button>
      </form>
    </div>
  );
};

export default SetPassword;
