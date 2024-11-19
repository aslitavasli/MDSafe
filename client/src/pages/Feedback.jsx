import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast'; // Import HotToast

const FeedbackForm = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  // const [isSentToMedSafe, setIsSentToMedSafe] = useState(false);
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
        //isSentToMedSafe,
      });
      if (response.status === 200) {
        // Show success toast
        toast.success('Feedback submitted successfully!');

        // Reset form after submission
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

    // Optionally, navigate to another page after submission
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '5px' }}>
            Message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          ></textarea>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Submit Anonymously
          </label>
          {/* <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={isSentToMedSafe}
              onChange={(e) => setIsSentToMedSafe(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Submit To MedSafe Platform
          </label> */}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#ccc' : '#007BFF',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>

      {/* Toaster container to show toasts */}
      <Toaster />
    </div>
  );
};

export default FeedbackForm;
