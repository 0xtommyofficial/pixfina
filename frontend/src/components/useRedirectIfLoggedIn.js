import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useRedirectIfLoggedIn() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            navigate('/landing');
        }
    }, [navigate]);
}