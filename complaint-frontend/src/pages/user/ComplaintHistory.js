import { useEffect, useState } from "react";
import API from "../../api/axios";

function ComplaintHistory() {

    const [complaints, setComplaints] = useState([]);
    useEffect(() => {
        fetchComplaints();
    }, []);
    const fetchComplaints = async () => {
        try {
            const email = localStorage.getItem("email");
            const response = await API.get(`/complaints/email/${email}`);
            setComplaints(response.data);

        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="complaint-history">
            <h2>Complaint History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Created Time</th>
                        <th>Title</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        complaints.map((complaint) => (
                            <tr key={complaint.id}>
                                <td>{new Date(complaint.createdAt).toLocaleString()}</td>
                                <td>{complaint.title}</td>
                                <td>{complaint.status}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default ComplaintHistory;