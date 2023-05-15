import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/');
    };

    return (
        <div>
            <h1>Welcome to the Members Landing Page!</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Landing;

