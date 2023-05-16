import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './apiClient';

const Landing = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        const token = localStorage.getItem('userToken');
        try {
            await apiClient.post('/logout/', {}, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            // if the logout was successful, remove the token from local storage
            localStorage.removeItem('userToken');
            // redirect to the main page
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div>
            <h1>Welcome to the Members Landing Page!</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Landing;
