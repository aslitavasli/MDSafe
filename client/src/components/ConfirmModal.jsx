// ConfirmModal.js
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // For accessibility

const ConfirmModal = ({ isOpen, onRequestClose, onConfirm, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirmation Modal"
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
          width: '300px', // Adjust width
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#fff', // Background color of the modal
        },
      }}
    >
      <h2 style={{color:'black'}}>Confirmation</h2>
      <p style={{color: 'black'}}>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button onClick={onConfirm} style={{ marginRight: '10px' }}>Confirm</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
