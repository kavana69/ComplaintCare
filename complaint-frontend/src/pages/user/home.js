import complaintImg from "../../assets/bg.jpg.avif";

function Home() {
    return (

        <div
            style={{
                display: "flex",
                gap: "30px",
                alignItems: "center",
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
            }}
        >

            {/* LEFT CONTENT */}
            <div style={{ flex: 1 }}>

                <h2
                    style={{
                        color: "#52439e",
                        marginBottom: "20px"
                    }}
                >
                    Complaint Management System
                </h2>

                <p style={{ lineHeight: "1.8", color: "#444" }}>
                    Welcome to the Complaint Management System.
                    This platform helps users register complaints,
                    track complaint status, and communicate with
                    support teams efficiently.
                </p>

                <p style={{ lineHeight: "1.8", color: "#444" }}>
                    Users can easily raise issues related to services
                    and monitor complaint progress in real time.
                </p>

                <p style={{ lineHeight: "1.8", color: "#444" }}>
                    Our goal is to provide faster resolutions and
                    improve customer satisfaction.
                </p>

            </div>

            {/* RIGHT IMAGE */}
            <div style={{ flex: 1 }}>

                <img
                    src={complaintImg}
                    alt="complaint"
                    style={{
                        width: "100%",
                        borderRadius: "10px"
                    }}
                />

            </div>

        </div>

    );
}

export default Home;