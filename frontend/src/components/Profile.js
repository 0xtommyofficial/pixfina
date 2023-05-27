import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './apiClient';
import useRedirectIfNotLoggedIn from './useRedirectIfNotLoggedIn';

const Profile = () => {
    useRedirectIfNotLoggedIn();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [isEmailEditing, setEmailEditing] = useState(false);
    const [isPasswordEditing, setPasswordEditing] = useState(false);
    const [email, setEmail] = useState('');
    const [repeatEmail, setRepeatEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isEmailLoading, setEmailLoading] = useState(false);
    const [isPasswordLoading, setPasswordLoading] = useState(false);
    const [error, setError] = useState(null);

    const isEmailValid = (email) => {
        const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return re.test(email);
    };

    const isPasswordValid = (password) => {
        return password.length >= 8;
    };

    useEffect(() => {
        // get the user details
        apiClient.get('/user_detail')
            .then(res => setUser(res.data))
            .catch(err => {
                console.error(err);
                if (err.response && err.response.data && err.response.data.detail) {
                    setError(`Fetch Error: ${err.response.data.detail}`);
                } else {
                    setError('An unexpected error occurred.');
                }
            });
    }, []);

    const handleEmailChange = () => {
        if (!oldPassword || !email || !repeatEmail || email !== repeatEmail) {
            setError('Please enter all fields');
            return;
        }

        if (!isEmailValid(email)) {
            setError('Please enter a valid email');
            return;
        }
        setEmailLoading(true);
        apiClient.put('/email_change/', { password: oldPassword, new_email: email })
            .then(res => {
                setUser(res.data);
                setEmailEditing(false);
            })
            .catch(err => {
                console.error(err);
                if (err.response && err.response.data && err.response.data.detail) {
                    setError(`Email Change Error: ${err.response.data.detail}`);
                } else {
                    setError('An error occurred');
                }
            })
            .finally(() => setEmailLoading(false));
    };

    const handlePasswordChange = () => {
        if (!oldPassword || !newPassword || !repeatPassword || newPassword !== repeatPassword) {
            setError('Please enter all fields correctly');
            return;
        }

        if (!isPasswordValid(newPassword)) {
            setError('Password should be at least 8 characters');
            return;
        }
        setPasswordLoading(true)
        apiClient.put('/password_change/', {
            old_password: oldPassword,
            new_password: newPassword,
            new_password_repeat: repeatPassword
        })
            .then(res => {
                setError('Password changed successfully');
                setPasswordEditing(false);
            })
            .catch(err => {
                console.error(err);
                if (err.response && err.response.data && err.response.data.detail) {
                    setError(`Password Change Error: ${err.response.data.detail}`);
                } else {
                    setError('An error occurred');
                }
            })
            .finally(() => setPasswordLoading(false));
    };

    return (
        <React.Fragment>
            <h1>User Details</h1>
            <h2>Name: {user.firstName} {user.lastName}</h2>
            <h2>Email: {user.email}</h2>
            {error && <p>{error}</p>} {/* display error message */}
            {isEmailEditing &&
                <div>
                    <input type="password" placeholder="Enter your password" onChange={e => setOldPassword(e.target.value)} />
                    <input type="email" placeholder="Enter new email" onChange={e => setEmail(e.target.value)} />
                    <input type="email" placeholder="Repeat new email" onChange={e => setRepeatEmail(e.target.value)} />
                    <button onClick={handleEmailChange}>Submit</button>
                </div>
            }
            <button onClick={() => setEmailEditing(!isEmailEditing)}>Change Email</button>
            {isPasswordEditing &&
                <div>
                    <input type="password" placeholder="Old Password" onChange={e => setOldPassword(e.target.value)} />
                    <input type="password" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} />
                    <input type="password" placeholder="Repeat New Password" onChange={e => setRepeatPassword(e.target.value)} />
                    <button onClick={handlePasswordChange}>Submit</button>
                </div>
            }
            <button onClick={() => setPasswordEditing(!isPasswordEditing)}>Change Password</button>
            <button onClick={() => navigate('/landing')}>Home</button>
        </React.Fragment>
    );
};

export default Profile;