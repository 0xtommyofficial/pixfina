import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import Landing from './components/Landing';
import Main from "./components/Main";
import Profile from "./components/Profile";
import Header from './components/Header';
import Footer from './components/Footer';
import EditorialBooking from "./components/EditorialBooking";
import HeadshotBooking from "./components/HeadshotBooking";
import Stock from "./components/Stock";

function App() {
    return (
        <Router>
            <Header />
            <div className="centered-column">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/HeadshotBooking" element={<HeadshotBooking />} />
                    <Route path="/EditorialBooking" element={<EditorialBooking />} />
                    <Route path="/Stock" element={<Stock />} />
                    {/* Catch all unhandled routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;

