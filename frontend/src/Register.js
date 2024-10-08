import React, { useState } from "react";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault(); // we don't want the page to reload so we stop it

        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password }),
            });

            // if the response was successful, we return a positive status, otherwise we inform the user of the issue
            const data = await response.json();
            // this checks if the code is between the range 200-299
            if (response.ok) {
                console.log(data.message);
                setMessage(data.message);
            } else {
                console.log(data.error);
                setMessage(data.error);
            }
        } catch (error) {
            setMessage("Error trying to register: ", error.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                {/* e is the event, e.target is the input field itself and e.target.value is the value within the input field */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="4"
                />
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Register;
