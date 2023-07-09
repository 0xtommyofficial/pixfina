import React, { useState, useEffect } from 'react';
import Select from 'react-select';
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
    const [favourites, setFavourites] = useState([]);
    const [selectedFavourite, setSelectedFavourite] = useState(null);

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

        // get the user's favourites
        apiClient.get('/favourites/')
            .then(res => {

                setFavourites(res.data);

                // set the first favourite as the selected one
                if (res.data.length > 0) {
                    setSelectedFavourite({ value: res.data[0].id, label: res.data[0].title });
                }
            })
            .catch(err => { console.error(err); });
    }, []);


    const options = favourites.map(favourite => (
        { value: favourite.id, label: favourite.title }
    ));

    const handleFavouriteSelection = selectedOption => {
        setSelectedFavourite(selectedOption);
    };

    const handleFavouriteRemove = () => {

        if (selectedFavourite) {
            apiClient.delete(`/favourite_media/${selectedFavourite.value}/`)
                .then(() => {
                    setFavourites(favourites.filter(fav => fav.id !== selectedFavourite.value));
                    setSelectedFavourite(null); // reset selected favourite
                })
                .catch(err => console.error(err));
        }
    };

    const handleEmailChange = () => {
        if (!oldPassword || !email || !repeatEmail || email !== repeatEmail) {
            setError('Please enter all fields correctly');
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
            <div className="profile-container padded-container">
                {error && <p>{error}</p>} {/* display error message */}
                <h2>Name: {user.firstName} {user.lastName}</h2>
                <h2>Email: {user.email}</h2>
                <h2>Favourites</h2>
                {favourites.length > 0 ?
                    <div>
                        <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={options}
                            onChange={handleFavouriteSelection}
                            value={selectedFavourite}
                        />
                        {selectedFavourite && <div className="gapped-column centered-column">
                            <h3>{selectedFavourite.label}</h3>
                            <img src={selectedFavourite.previewImageUrl} alt={selectedFavourite.label} />
                            <button className="form-button"
                                    onClick={() => handleFavouriteRemove(selectedFavourite.value)}>Remove</button>
                        </div>}
                    </div>
                    : <p>No favourites found</p>}
                <div className="gapped-row padded-container">
                    <button onClick={() => setEmailEditing(!isEmailEditing)}>Change Email</button>
                    <button onClick={() => setPasswordEditing(!isPasswordEditing)}>Change Password</button>
                </div>
                <div className="gapped-column">
                    {isEmailEditing &&
                        <div className="edit-form">
                            <input className="form-input" type="email" placeholder="Enter new email"
                                   onChange={e => setEmail(e.target.value)} />
                            <input className="form-input" type="email" placeholder="Repeat new email"
                                   onChange={e => setRepeatEmail(e.target.value)} />
                            <input className="form-input" type="password" placeholder="Enter your password"
                                   onChange={e => setOldPassword(e.target.value)} />
                            <button className="form-button" onClick={handleEmailChange}
                                    disabled={isEmailLoading}>Submit</button>
                        </div>
                    }
                    {isPasswordEditing &&
                        <div className="edit-form">
                            <input className="form-input" type="password" placeholder="Old Password"
                                   onChange={e => setOldPassword(e.target.value)} />
                            <input className="form-input" type="password" placeholder="New Password"
                                   onChange={e => setNewPassword(e.target.value)} />
                            <input className="form-input" type="password" placeholder="Repeat New Password"
                                   onChange={e => setRepeatPassword(e.target.value)} />
                            <button className="form-button" onClick={handlePasswordChange}
                                    disabled={isPasswordLoading}>Submit</button>
                        </div>
                    }
                </div>
                <div className="centered-column padding-top">
                    <button onClick={() => navigate('/landing')}>Home</button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Profile;