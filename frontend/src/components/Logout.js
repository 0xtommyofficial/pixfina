import React, { useEffect } from 'react';
import apiClient from './apiClient';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.post('/logout/')
            .then(response => {
                if (response.status === 200) {

                    window.dispatchEvent(new Event('logout'));
                    navigate('/');
                } else {
                    console.error('Logout failed: ', response);
                }
            })
            .catch(error => {
                console.error('Error during logout: ', error);
            })
            .finally(() => {
                localStorage.removeItem('userToken');
            });
    }, [navigate]);

    return <div>Logging out...</div>;
};

export default Logout;
