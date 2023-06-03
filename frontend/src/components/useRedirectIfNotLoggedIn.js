import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useRedirectIfNotLoggedIn() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/Login');
        }
    }, [navigate]);
}

