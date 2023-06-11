import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import SignupForm from './components/Signup';
// import Landing from './components/Landing';
import Main from "./components/Main";
import Profile from "./components/Profile";
import Header from './components/Header';
import Footer from './components/Footer';
import EditorialBooking from "./components/EditorialBooking";
import HeadshotBooking from "./components/HeadshotBooking";
import Stock from "./components/Stock";
import LicenceQuote from "./components/LicenceQuote";

function App() {
    return (
        <Router>
            <Header />
            <div className="app-body centered-column main">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/HeadshotBooking" element={<HeadshotBooking />} />
                    <Route path="/EditorialBooking" element={<EditorialBooking />} />
                    <Route path="/Stock" element={<Stock />} />
                    <Route path="/LicenceQuote" element={<LicenceQuote />} />
                    {/* Catch all unhandled routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;

