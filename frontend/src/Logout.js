import React, { useState } from "react";

function Logout() {
    const [message, setMessage] = useState("");

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
            } else {
                setMessage("There was an error logging out.");
            }
        } catch (error) {
            console.error("Error trying to log out: ", error.message);
        }
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
            <p>{message}</p>
        </div>
    );
}

export default Logout;
