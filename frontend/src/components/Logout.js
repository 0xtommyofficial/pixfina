import React, { useEffect } from 'react';
import apiClient from './apiClient';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from './helpers';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.post('/logout/')
            .then(response => {
                if (response.status === 200) {
                    handleLogout();
                    navigate('/');
                } else {
                    console.error('Logout failed: ', response);
                }
            })
            .catch(error => {
                console.error('Error during logout: ', error);
                handleLogout()
                navigate('/');
            });
    }, [navigate]);

    return <div>Logging out...</div>;
};

export default Logout;
