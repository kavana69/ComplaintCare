import React, { useEffect, useState } from "react";
import "../../styles/AdminComplaints.css";

const AdminComplaints = () => {

    const [list, setList] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const token = localStorage.getItem("token");

    // FETCH ALL COMPLAINTS
    const fetchData = async () => {

        try {

            const res = await fetch(
                "http://localhost:8080/complaints",
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            const data = await res.json();

            const finalData = Array.isArray(data)
                ? data
                : data.data || data.content || [];

            setList(finalData);

        } catch (err) {

            console.error("Error fetching complaints:", err);
            setList([]);
        }
    };

    // UPDATE STATUS
    const updateStatus = async (id, status) => {

        try {

            await fetch(
                `http://localhost:8080/complaints/${id}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },

                    body: JSON.stringify({
                        status: status,
                    }),
                }
            );

            fetchData();

        } catch (err) {

            console.error("Error updating status:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // FILTER
    const filteredComplaints = list.filter((c) => {

        const matchesTitle =
            c.title &&
            c.title
                .toLowerCase()
                .includes(searchTitle.toLowerCase());

        const matchesStatus =
            statusFilter === "ALL" ||
            c.status === statusFilter;

        return matchesTitle && matchesStatus;
    });

    return (

        <div className="admin-complaints-container">

            <h2 className="admin-complaints-title">
                All Complaints
            </h2>

            {/* SEARCH + FILTER */}

            <div className="complaints-filter-bar">

                <input
                    type="text"
                    placeholder="Search by title..."
                    className="search-input"
                    value={searchTitle}
                    onChange={(e) =>
                        setSearchTitle(e.target.value)
                    }
                />

                <select
                    className="status-filter"
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >

                    <option value="ALL">
                        All Status
                    </option>

                    <option value="OPEN">
                        OPEN
                    </option>

                    <option value="ASSIGNED">
                        ASSIGNED
                    </option>

                    <option value="INPROGRESS">
                        INPROGRESS
                    </option>

                    <option value="RESOLVED">
                        RESOLVED
                    </option>

                </select>

            </div>

            {/* TABLE */}

            <div className="complaints-table-wrapper">

                {

                    filteredComplaints.length === 0 ? (

                        <div className="no-data">
                            No complaints found
                        </div>

                    ) : (

                        <table className="complaints-table">

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>User ID</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
                                    <th>Update Status</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredComplaints.map((c) => (

                                    <tr key={c.id}>

                                        <td>{c.id}</td>

                                        <td>{c.title}</td>

                                        <td>{c.description}</td>

                                        <td>

                                            <span
                                                className={`status-badge ${c.status || "OPEN"}`}
                                            >
                                                {c.status || "OPEN"}
                                            </span>

                                        </td>

                                        <td>{c.userId}</td>

                                        <td>{c.createdAt}</td>

                                        <td>{c.updatedAt}</td>

                                        <td>

                                            <select
                                                className="status-dropdown"
                                                value={c.status}
                                                onChange={(e) =>
                                                    updateStatus(
                                                        c.id,
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                <option value="OPEN">
                                                    OPEN
                                                </option>

                                                <option value="ASSIGNED">
                                                    ASSIGNED
                                                </option>

                                                <option value="INPROGRESS">
                                                    INPROGRESS
                                                </option>

                                                <option value="RESOLVED">
                                                    RESOLVED
                                                </option>

                                            </select>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )

                }

            </div>

        </div>

    );
};

export default AdminComplaints;