import React, { useEffect, useState } from "react";
import { Form, Button, Collapse } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast";

const FeedbackDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isAnonymous, setIsAnonymous] = useState(false); // Filter for anonymous feedback
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false); // State to toggle date filter visibility

  // Fetch feedbacks from the backend
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("/viewfeedback");
      setFeedbacks(response.data);
    } catch (error) {
      toast.error("Error fetching feedback!");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Filter feedbacks based on date, search query, and anonymity
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const feedbackDate = new Date(feedback.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Date filtering
    if (start && feedbackDate < start) return false;
    if (end && feedbackDate > end) return false;

    // Filter by anonymity
    if (isAnonymous && !feedback.isAnonymous) return false;

    // Search feedback by title, body, or user name
    if (searchQuery && feedback.title) {
      const userName = feedback.user ? `${feedback.user.name} ${feedback.user.surname}` : "";
      if (
        !feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !feedback.body.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !userName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
    }

    return true;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Feedback Dashboard</h2>

      {/* Search Feedback */}
      <Form style={{ marginBottom: "10px" }}>
        <Form.Group controlId="searchFeedback">
          <Form.Label>Search Feedback</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by title, message, or user"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>
      </Form>

      {/* Filter Button and Collapsible Date Filter */}
      <Button
        onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
        aria-controls="dateFilterForm"
        aria-expanded={isDateFilterOpen}
        style={{ marginBottom: "10px" }}
      >
        {isDateFilterOpen ? "Hide Date Filter" : "Filter by Date"}
      </Button>

      <Collapse in={isDateFilterOpen}>
        <div id="dateFilterForm" style={{ marginBottom: "20px" }}>
          <Form>
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </div>
      </Collapse>

      {/* Filter Anonymous Feedback */}
      <Form.Check
        type="checkbox"
        label="Show only anonymous feedback"
        checked={isAnonymous}
        onChange={() => setIsAnonymous(!isAnonymous)}
        style={{ marginBottom: "20px" }}
      />

      {/* Scrollable List of Feedbacks */}
      <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
        {filteredFeedbacks.map((feedback) => (
          <div key={feedback._id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
            <h4>{feedback.title}</h4>
            <p><strong>User:</strong> {feedback.isAnonymous ? "Anonymous" : `${feedback.user?.name} ${feedback.user?.surname}`}</p>
            <p><strong>Message:</strong></p>
            <p style={{ whiteSpace: "pre-wrap" }}>{feedback.body}</p>
            <p><strong>Created At:</strong> {new Date(feedback.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackDashboard;
