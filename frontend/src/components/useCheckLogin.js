import { useEffect, useState } from 'react';

function useCheckLogin() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('userToken');
            setIsLoggedIn(!!token);
            // console.log('isLoggedIn: ', !!token);
        };

        checkLoginStatus();

        // listen for logout event
        window.addEventListener('login', checkLoginStatus);
        window.addEventListener('logout', checkLoginStatus);

        // cleanup
        return () => {
            window.removeEventListener('login', checkLoginStatus);
            window.removeEventListener('logout', checkLoginStatus);
        };
    }, []);

    return isLoggedIn;
}

export default useCheckLogin;
