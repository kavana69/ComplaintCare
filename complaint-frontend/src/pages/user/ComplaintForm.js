import { useState } from "react";
import API from "../../api/axios";
import "../../styles/ComplaintForm.css";

function ComplaintForm() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await API.post("/complaints", {
                title,
                description
            });

            alert("Complaint submitted!");

            setTitle("");
            setDescription("");

        } catch (err) {

            console.error(err);

            alert("Error submitting complaint");
        }
    };

    return (

        <div className="complaint-container">

            <h2 className="complaint-title">
                Register Complaint
            </h2>

            <p className="complaint-subtitle">
                Please describe your issue clearly
            </p>

            <form
                className="complaint-form"
                onSubmit={handleSubmit}
            >

                <div className="form-group">

                    <label>Complaint Title</label>

                    <input
                        type="text"
                        placeholder="Enter complaint title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                </div>

                <div className="form-group">

                    <label>Description</label>

                    <textarea
                        placeholder="Describe your complaint"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                </div>

                <button
                    type="submit"
                    className="submit-btn"
                >
                    Submit Complaint
                </button>

            </form>

        </div>
    );
}

export default ComplaintForm;