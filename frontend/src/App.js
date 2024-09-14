import React from "react";
import Verse from "./Verse";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import AdminPanel from "./AdminPanel";
import FavouritesList from "./FavouritesList";

function App() {
    return (
        <div>
            <Register />
            <Login />
            <Logout />
            <Verse />
            <AdminPanel />
            <FavouritesList />
        </div>
    );
}

export default App;
