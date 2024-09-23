import React from "react";
import { AppBar, Container } from "@mui/material";
import Verse from "./Verse";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import AdminPanel from "./AdminPanel";
import FavouritesList from "./FavouritesList";

function App() {
    return (
        <Container>
            <Register />
            <Login />
            <Logout />
            <Verse />
            <AdminPanel />
            <FavouritesList />
        </Container>
    );
}

export default App;
