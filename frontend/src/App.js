import React from "react";
import Verse from "./Verse";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import AdminPanel from "./AdminPanel";

function App() {
    return (
        <div>
            <Register />
            <Login />
            <Logout />
            <Verse />
            <AdminPanel />
        </div>
    );
}

export default App;
