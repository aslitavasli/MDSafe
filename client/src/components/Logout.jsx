import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditUserModal from '../components/EditUserModal';

const Logout = () => {
  const [user, setUser] = useState({ name: '', surname: '' });
  const navigate = useNavigate();
  const [editUser, setEditUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

   
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get("/profile");
        console.log("API Response:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } 
    }

    if (!user.name && !user.surname) {
      fetchUserData();
    }
  }, [user]); // Empty dependency array ensures this runs once on mount



  const handleUpdate = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleUserUpdated = async (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
    await fetchUsers();
  };

  const handleLogout = async () => {
    console.log('hiii');
    // try {
    const response = await axios.post('/logout');
    // if (response.ok) {
    // Clear tokens or any user-related data
   
    setUser({name: '', surname: ''})
    navigate('/login');
   
    // } else {
    //   console.error('Failed to log out');
    // }
    // } catch (error) {
    //   console.error('Error logging out:', error);
    // }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        {user.name} {user.surname}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>

      {editUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          user={editUser}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </Dropdown>
  );
};

export default Logout;