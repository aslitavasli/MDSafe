import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import ConfirmModal from "../components/ConfirmModal";
import EditUserModal from "../components/EditUserModal";
import RegisterUserModal from "../components/RegisterUserModal";
import { toast } from "react-hot-toast";

const EditUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterAdmin, setFilterAdmin] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/viewusers");
      setUsers(response.data);
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdate = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteRequest = (user) => {
    setModalUser(user);
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = async () => {
    if (modalUser) {
      try {
        const response = await axios.delete(`/users/${modalUser._id}`);
        if (response.status === 200) {
          toast.success("User deleted successfully");
          await fetchUsers();
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.error("You cannot delete yourself.");
        } else {
          toast.error("Error deleting user.");
        }
      } finally {
        setIsConfirmModalOpen(false);
        setModalUser(null); // Clear the modal user state after action.
      }
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedUsers.map((userId) =>
        axios.delete(`/users/${userId}`)
      );
      await Promise.all(deletePromises);
      toast.success("Selected users deleted successfully");
      await fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      if (error.response.status === 403) {
        toast.error("You cannot delete yourself.");
      } else {
        toast.error("Error deleting users.");
      }
    }
  };

  const handleUserUpdated = async (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
    await fetchUsers();
  };

  const handleUserRegistered = async (newUser) => {
    try {
      const { data } = await axios.post("/register", { ...newUser });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("User registered successfully");
        setUsers((prevUsers) => [...prevUsers, newUser]);
        setData({});
        navigate("/");
        await fetchUsers(); // Refresh the list after registration.
        setIsRegisterModalOpen(false); // Close modal after successful registration.
      }
    } catch (error) {
      toast.error("Error registering user");
    }
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => filterAdmin === null || user.admin === filterAdmin)
    .filter((user) => !user.email.includes('@shelfquest.app'));

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const sortOptions = [
    { value: "asc", label: "Sort A to Z" },
    { value: "desc", label: "Sort Z to A" },
  ];

  const filterOptions = [
    { value: "", label: "Filter by Admin Status" },
    { value: "true", label: "Admin" },
    { value: "false", label: "Non-Admin" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <Button
        variant="success"
        onClick={() => setIsRegisterModalOpen(true)}
        style={{ marginBottom: "10px", marginRight: "10px" }}
      >
        Add New User
      </Button>
      <Button
        variant="danger"
        onClick={handleDeleteSelected}
        disabled={selectedUsers.length === 0}
        style={{ marginBottom: "10px" }}
      >
        Delete Selected
      </Button>

      <Form style={{ marginBottom: "10px" }}>
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="sort">
          <Select
            options={sortOptions}
            value={sortOptions.find((option) => option.value === sortOrder)}
            onChange={(option) => setSortOrder(option.value)}
            placeholder="Sort By"
            styles={{ control: (base) => ({ ...base, marginBottom: "10px" }) }}
          />
        </Form.Group>
        <Form.Group controlId="filter">
          <Select
            options={filterOptions}
            value={filterOptions.find(
              (option) =>
                option.value ===
                (filterAdmin === null ? "" : filterAdmin.toString())
            )}
            onChange={(option) =>
              setFilterAdmin(
                option.value === "" ? null : option.value === "true"
              )
            }
            placeholder="Filter By Admin Status"
            styles={{ control: (base) => ({ ...base, marginBottom: "10px" }) }}
          />
        </Form.Group>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Location</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleCheckboxChange(user._id)}
                />
              </td>
              <td>
                {user.name} {user.surname}
              </td>
              <td>
                {user.location}
              </td>
              <td>{user.email}</td>
              <td>{user.admin ? "Yes" : "No"}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleUpdate(user)}
                  style={{ marginRight: "5px" }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteRequest(user)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {modalUser && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onRequestClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirm}
          message={`Are you sure you want to delete ${modalUser.name} ${modalUser.surname} from your institution?`}
        />
      )}

      {editUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          user={editUser}
          onUserUpdated={handleUserUpdated}
        />
      )}

      <RegisterUserModal
        isOpen={isRegisterModalOpen}
        onRequestClose={() => setIsRegisterModalOpen(false)}
        onUserRegistered={handleUserRegistered}
      />
    </div>
  );
};

export default EditUsers;
