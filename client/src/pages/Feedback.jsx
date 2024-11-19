import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast'; // Import HotToast

const FeedbackForm = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('Please fill out both the title and message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/submitfeedback', {
        title,
        message,
        isAnonymous,
      });
      if (response.status === 200) {
        toast.success('Feedback submitted successfully!');
        setTitle('');
        setMessage('');
        setIsAnonymous(false);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }

    navigate('/');
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: '#fff', // Changed background to white
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Modern system fonts
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#333', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        Submit Your Feedback
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="title" style={{ fontSize: '16px', color: '#333', marginBottom: '8px', display: 'block' }}>
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter feedback title..."
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #f0f0f0', // Off-white border
              outline: 'none',
              transition: 'border-color 0.3s ease',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Matching font
            }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="message" style={{ fontSize: '16px', color: '#333', marginBottom: '8px', display: 'block' }}>
            Message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback here..."
            rows="6"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #f0f0f0', // Off-white border
              outline: 'none',
              transition: 'border-color 0.3s ease',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Matching font
            }}
          ></textarea>
        </div>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            style={{ marginRight: '10px', transform: 'scale(1.2)' }}
          />
          <span style={{ fontSize: '14px', color: '#555', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            Submit Anonymously
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            backgroundColor: isSubmitting ? '#bbb' : '#b71c1c',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Matching font
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>

  
    </div>
  );
};

export default FeedbackForm;
