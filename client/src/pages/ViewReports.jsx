import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch reports from the backend
  const fetchReports = async () => {
    try {
      const response = await axios.get("/viewreports");
      
      setReports(response.data);
    } catch (error) {
      toast.error("Error fetching reports!");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter reports based on start and end date
  const filteredReports = reports.filter((report) => {
    const reportDate = new Date(report.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && reportDate < start) return false;
    if (end && reportDate > end) return false;
    return true;
  });

  const sortReports = filteredReports.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports</h2>

      <Form style={{ marginBottom: "10px" }}>
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

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Level</th>
            <th>Location</th>
            <th>User</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {sortReports.map((report) => (
            <tr key={report._id}>
              <td>{report.level}</td>
              <td>{report.location}</td>
              <td>{report.user ? `${report.user.name} ${report.user.surname}` : "Unknown"}</td>
              <td>{new Date(report.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Reports;
