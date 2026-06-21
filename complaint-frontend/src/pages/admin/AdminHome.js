import React, { useEffect, useState } from "react";
import "../../styles/AdminHome.css";

const AdminHome = () => {
  const [stats, setStats] = useState({});
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");

  const token = localStorage.getItem("token");

  

  useEffect(() => {
    fetch("http://localhost:8080/complaints", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let open = 0;
        let assigned = 0;
        let progress = 0;
        let resolved = 0;

        data.forEach((c) => {
          if (c.status === "OPEN") open++;
          else if (c.status === "ASSIGNED") assigned++;
          else if (c.status === "INPROGRESS") progress++;
          else if (c.status === "RESOLVED") resolved++;
        });

        setStats({
          total: data.length,
          open,
          assigned,
          progress,
          resolved,
        });

        // RECENT 5 COMPLAINTS
        setRecentComplaints(data.slice(-5).reverse());
      })
      .catch((err) => console.log(err));
  }, []);
    const filteredComplaints = recentComplaints.filter((c) => {
  const titleMatch =
    c.title.toLowerCase().includes(searchTerm.toLowerCase());

  const statusMatch =
    statusFilter === "ALL" ||
    c.status === statusFilter;

  return titleMatch && statusMatch;
});
  return (
    <div className="admin-home">
      {/* WELCOME BANNER */}
      <div className="welcome-banner">
        <h2>Welcome Admin 👋</h2>

        <p>
          Manage complaints, monitor statuses and track
          complaint activities.
        </p>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Complaints</h3>
          <p>{stats.total || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Open Complaints</h3>
          <p>{stats.open || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Assigned</h3>
          <p>{stats.assigned || 0}</p>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{stats.progress || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Closed Complaints</h3>
          <p>{stats.resolved || 0}</p>
        </div>

      </div>
      {/* RECENT COMPLAINTS */}
      <div className="recent-section">

        <h2>Recent Complaints</h2>
        <div className="filter-bar">

  <input
    type="text"
    placeholder="Search by title..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="status-filter"
  >
    <option value="ALL">All Status</option>
    <option value="OPEN">OPEN</option>
    <option value="ASSIGNED">ASSIGNED</option>
    <option value="INPROGRESS">IN PROGRESS</option>
    <option value="RESOLVED">RESOLVED</option>
  </select>

</div>

        <table className="recent-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>User</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>

                <td>{c.title}</td>

                <td>
                  <span
                    className={`status-badge ${
                      c.status || "OPEN"
                    }`}
                  >
                    {c.status || "OPEN"}
                  </span>
                </td>

                <td>{c.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      

    </div>
  );
};

export default AdminHome;