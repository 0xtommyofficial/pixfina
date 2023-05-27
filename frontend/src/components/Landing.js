import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './apiClient';
import useRedirectIfNotLoggedIn from './useRedirectIfNotLoggedIn';

const Landing = () => {
    useRedirectIfNotLoggedIn();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    // clear any previous error when the component mounts
    useEffect(() => {
        setError(null);
    }, []);

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

            // handle error based on server response
            if (error.response && error.response.data && error.response.data.detail) {
                setError(`Logout Error: ${error.response.data.detail}`);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <React.Fragment>
            <h1>Welcome to the Members Landing Page!</h1>
            {error && <p>{error}</p>} {/* display error message */}
            <button onClick={handleLogout}>Logout</button>
            <h1>Manage your details:</h1>
            <button onClick={() => navigate('/profile')}>Profile</button>
        </React.Fragment>
    );
};

export default Landing;
