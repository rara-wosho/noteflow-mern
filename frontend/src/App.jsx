import React from "react";
import { Routes, Route } from "react-router";
import Homepage from "./pages/Homepage";
import NotesPage from "./pages/NotesPage";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/notes" element={<NotesPage />} />
        </Routes>
    );
};

export default App;
