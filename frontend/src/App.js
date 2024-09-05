import React from "react";
import Verse from "./Verse";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";

function App() {
    return (
        <div>
            <Register />
            <Login />
            <Logout />
            <Verse />
        </div>
    );
}

export default App;
