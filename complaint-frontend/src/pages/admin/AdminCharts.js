import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";
import "../../styles/AdminCharts.css";

const COLORS = ["#4f46e5", "#f59e0b", "#10b981", "#ef4444"];

const AdminCharts = ({}) => {

  // =========================
  // STATES
  // =========================

  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  

  const token = localStorage.getItem("token");

   useEffect(() => {

    fetchUsers();
    fetchComplaints();

  }, []);

  // FETCH USERS
  const fetchUsers = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8081/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("USERS:", response.data);

      setUsers(response.data);

    } catch (error) {

      console.error("User fetch error:", error);

    }
  };

  // FETCH COMPLAINTS
  const fetchComplaints = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8080/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(response.data);

    } catch (error) {

      console.error("Complaint fetch error:", error);

    }
  };

  // =========================
  // COMPLAINT STATUS COUNTS
  // =========================

  let open = 0;
  let assigned = 0;
  let inprogress = 0;
  let resolved = 0;

  complaints.forEach((c) => {

    if (c.status === "OPEN") {
      open++;
    }

    else if (c.status === "ASSIGNED") {
      assigned++;
    }

    else if (c.status === "INPROGRESS") {
      inprogress++;
    }

    else if (c.status === "RESOLVED") {
      resolved++;
    }

  });

  // =========================
  // PIE CHART DATA
  // =========================

  const pieData = [
    { name: "OPEN", value: open },
    { name: "ASSIGNED", value: assigned },
    { name: "INPROGRESS", value: inprogress },
    { name: "RESOLVED", value: resolved },
  ];

  // =========================
  // BAR CHART DATA
  // =========================

  const barData = [
    { name: "Open", complaints: open },
    { name: "Assigned", complaints: assigned },
    { name: "In Progress", complaints: inprogress },
    { name: "Resolved", complaints: resolved },
  ];

  // =========================
  // WEEKLY COMPLAINT DATA
  // =========================

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weeklyMap = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  complaints.forEach((c) => {

    if (c.createdAt) {

      const day = days[new Date(c.createdAt).getDay()];

      weeklyMap[day]++;

    }

  });

  const weeklyData = Object.keys(weeklyMap).map((day) => ({
    day,
    complaints: weeklyMap[day],
  }));

  // =========================
  // USER ANALYTICS
  // =========================

  const totalUsers = users.length;

  const totalAdmins = users.filter(
    (u) =>
      u.role === "ROLE_ADMIN" ||
      u.role === "ADMIN"
  ).length;

  const normalUsers = users.filter(
    (u) =>
      u.role === "ROLE_USER" ||
      u.role === "USER"
  ).length;

  const userChartData = [
    {
      name: "Users",
      value: normalUsers,
    },
    {
      name: "Admins",
      value: totalAdmins,
    },
  ];

  // =========================
  // RETURN
  // =========================

  return (

    <div className="charts-container">

      {/* ================= CARDS ================= */}

      <h2 className="charts-title">
        Analytics Dashboard
      </h2>

      <div className="analytics-cards">

        <div className="analytics-card">
          <h3>Total Complaints</h3>
          <p>{complaints.length}</p>
        </div>

        <div className="analytics-card open-card">
          <h3>Open</h3>
          <p>{open}</p>
        </div>

        <div className="analytics-card assigned-card">
          <h3>Assigned</h3>
          <p>{assigned}</p>
        </div>

        <div className="analytics-card progress-card">
          <h3>In Progress</h3>
          <p>{inprogress}</p>
        </div>

        <div className="analytics-card resolved-card">
          <h3>Resolved</h3>
          <p>{resolved}</p>
        </div>

      </div>

      {/* ================= CHARTS ================= */}

      <div className="charts-grid">

        {/* BAR CHART */}

        <div className="chart-box">

          <h3>Status Overview</h3>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={barData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="complaints"
                fill="#4f46e5"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* PIE CHART */}

        <div className="chart-box">

          <h3>Complaint Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >

                {pieData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* LINE CHART */}

        <div className="chart-box full-width">

          <h3>Weekly Complaints Trend</h3>

          <ResponsiveContainer width="100%" height={350}>

            <LineChart data={weeklyData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="complaints"
                stroke="#7c3aed"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ================= USER ANALYTICS ================= */}

      <h2 className="user-analytics-title">
        User Registration Analytics
      </h2>

      <div className="user-analytics-cards">

        <div className="user-card">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>

        <div className="user-card">
          <h3>Admins</h3>
          <p>{totalAdmins}</p>
        </div>

        <div className="user-card">
          <h3>Normal Users</h3>
          <p>{normalUsers}</p>
        </div>

      </div>

      {/* USER CHART */}

      <div className="chart-box full-width">

        <h3>User Distribution</h3>

        <ResponsiveContainer width="100%" height={350}>

          <BarChart data={userChartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="value"
              fill="#6366f1"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

};

export default AdminCharts;