import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Select from 'react-select';

Modal.setAppElement('#root'); // For accessibility

const RegisterUserModal = ({ isOpen, onRequestClose, onUserRegistered }) => {
    const [data, setData] = useState({
        name: '',
        surname: '',
        email: '',
        location: '',
        // password: '',
        // institution: '',
        admin: false, // Initial state
    });

    const institutions = [
        { value: 'Dartmouth College', label: 'Dartmouth College' },
        { value: 'Upper Arlington High School', label: 'Upper Arlington High School' },
        { value: 'Dropout College', label: 'Dropout College' },
        // Add more institutions as needed
    ];

    const switchStyles = {
        switch: {
            position: 'relative',
            display: 'inline-block',
            width: '40px',
            height: '20px',
        },
        input: {
            opacity: 0,
            width: 0,
            height: 0,
        },
        slider: {
            position: 'absolute',
            cursor: 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#ccc',
            transition: '0.4s',
            borderRadius: '34px',
        },
        sliderBefore: {
            position: 'absolute',
            content: '""',
            height: '14px',
            width: '14px',
            left: '3px',
            bottom: '3px',
            backgroundColor: 'white',
            transition: '0.4s',
            borderRadius: '50%',
        },
        sliderChecked: {
            backgroundColor: '#007bff',
        },
        sliderBeforeChecked: {
            transform: 'translateX(18px)',
        },
    };

    const registerUser = async (e) => {
        e.preventDefault();
        const { name, surname, location, email, admin } = data;

        try {
            const response = await axios.post('/register', { name, surname, location, email, admin });
            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                onUserRegistered(response.data); // Add the new user to the list
                setData({
                    name: '',
                    surname: '',
                    email: '',
                    location: '',
                    // password: '',
                    // institution: '',
                    admin: false, // Reset admin state
                });
                toast.success('User registered successfully');
                onRequestClose(); // Close the modal
            }
        } catch (error) {
            console.error(error);
            toast.error('Error registering user.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Register User Modal"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    width: '400px', // Adjust width
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#fff', // Background color of the modal
                },
            }}
        >
            <h2 style={{color: 'black'}}>Add New User</h2>
            <form onSubmit={registerUser}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{color: 'black'}}>Name</label>
                    <input
                        type="text"
                        placeholder="Enter name..."
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{color: 'black'}}>Surname</label>
                    <input
                        type="text"
                        placeholder="Enter surname..."
                        value={data.surname}
                        onChange={(e) => setData({ ...data, surname: e.target.value })}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{color: 'black'}}>Email</label>
                    <input
                        type="email"
                        placeholder="Enter institutional email..."
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>

                {/* <div style={{ marginBottom: '15px' }}>
                    <label style={{color: 'black'}}>Password</label>
                    <input
                        type="password"
                        placeholder="Enter password..."
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div> */}
{/* 
                <div style={{ marginBottom: '15px' }}>
                    <label style={{color: 'black'}}>Institution</label>
                    <Select
                        options={institutions}
                        onChange={(selectedOption) => setData({ ...data, institution: selectedOption.value })}
                        placeholder="Select or type institution..."
                        isSearchable
                        required
                    />
                </div> */}

                <div style={{ marginBottom: '15px' }}>
                    <label style={{color: 'black'}}>Location</label>
                    <input
                        type="text"
                        placeholder="Enter primary location..."
                        value={data.location}
                        onChange={(e) => setData({ ...data, location: e.target.value })}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: 'black', marginRight: '10px' }}>Admin? </label>
                    <label style={switchStyles.switch}>
                        <input
                            type="checkbox"
                            checked={data.admin}
                            onChange={(e) => setData({ ...data, admin: e.target.checked })}
                            style={switchStyles.input}
                        />
                        <span
                            style={{
                                ...switchStyles.slider,
                                ...(data.admin ? switchStyles.sliderChecked : {}),
                            }}
                        >
                            <span
                                style={{
                                    ...switchStyles.sliderBefore,
                                    ...(data.admin ? switchStyles.sliderBeforeChecked : {}),
                                }}
                            />
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    style={{
                        marginTop: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Register
                </button>
            </form>
            <button
                onClick={onRequestClose}
                style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Close
            </button>
        </Modal>
    );
};

export default RegisterUserModal;
