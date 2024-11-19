import React, { useEffect, useState } from "react";
import { Table, Form, Button, Collapse } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" }); // State for sorting
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false); // State to toggle date filter visibility

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

  // Filter reports based on start and end date, and search query
  const filteredReports = reports.filter((report) => {
    const reportDate = new Date(report.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Date filtering
    if (start && reportDate < start) return false;
    if (end && reportDate > end) return false;

    // Search user by name or surname
    if (searchQuery && report.user) {
      const fullName = `${report.user.name} ${report.user.surname}`.toLowerCase();
      if (!fullName.includes(searchQuery.toLowerCase())) return false;
    }

    return true;
  });

  // Sort reports based on sortConfig
  const sortedReports = filteredReports.sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Sorting by createdAt (date)
    if (sortConfig.key === "createdAt") {
      return sortConfig.direction === "desc"
        ? new Date(bValue) - new Date(aValue)
        : new Date(aValue) - new Date(bValue);
    } 
    // Sorting by level
    else if (sortConfig.key === "level") {
      return sortConfig.direction === "desc" ? bValue - aValue : aValue - bValue;
    }
    return 0;
  });

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Render arrow based on sort direction
  const renderArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports</h2>

      {/* Search User */}
      <Form style={{ marginBottom: "10px" }}>
        <Form.Group controlId="searchUser">
          <Form.Label>Search User</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by name or surname"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>
      </Form>

      {/* Filter Button and Collapsible Form */}
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

      {/* Table with Sorting */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort("level")}>
              Level {renderArrow("level")}
            </th>
            <th>Location</th>
            <th>User</th>
            <th onClick={() => handleSort("createdAt")}>
              Created At {renderArrow("createdAt")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedReports.map((report) => (
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
