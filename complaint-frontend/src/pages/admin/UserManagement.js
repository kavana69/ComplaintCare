import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/UserManagement.css";

function UserManagement() {

    const [users, setUsers] = useState([]);

    const token = localStorage.getItem("token");
    const [search, setSearch] = useState("");
const [roleFilter, setRoleFilter] = useState("ALL");

    useEffect(() => {
        fetchUsers();
    }, []);

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

            setUsers(response.data);

        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const blockUser = async (id) => {

        try {

            await axios.put(
                `http://localhost:8081/admin/block/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchUsers();

        } catch (error) {
            console.error("Error blocking user:", error);
        }
    };

    const deleteUser = async (id) => {

        try {

            await axios.delete(
                `http://localhost:8081/admin/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchUsers();

        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
    const filteredUsers = users.filter((user) => {

    const matchesSearch =
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
});

    return (

        <div className="user-management-container">

            <h2>User Management</h2>
            <div className="user-filters">

    <input
        type="text"
        placeholder="Search by username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
    />

    <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="role-filter"
    >

        <option value="ALL">All Roles</option>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
        <option value="BLOCKED">BLOCKED</option>

    </select>

</div>

            <table className="user-table">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {users.length > 0 ? (

                        filteredUsers.map((user) => (

                            <tr key={user.id}>

                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>

                                <td>

                                    <button
                                        className="block-btn"
                                        onClick={() => blockUser(user.id)}
                                    >
                                        Block
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteUser(user.id)}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>
                        ))

                    ) : (

                        <tr>
                            <td colSpan="5">No users found</td>
                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default UserManagement;