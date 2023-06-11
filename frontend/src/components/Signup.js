import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import apiClient from './apiClient';
import useRedirectIfLoggedIn from './useRedirectIfLoggedIn';

const SignupForm = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        captcha: '',
    });
    const [captchaImg, setCaptchaImg] = useState(null);
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const isMounted = React.useRef(true);

    // if user is already logged in, redirect to landing page
    useRedirectIfLoggedIn();

    // before the component unmounts, update the isMounted value
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchCaptcha = async () => {
        try {
            const response = await apiClient.get('/generate_captcha/', { responseType: 'blob' });
            const objectUrl = URL.createObjectURL(response.data);
            setCaptchaImg(objectUrl);
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
    };

    const refreshCaptcha = () => {
        // reset the captcha field
        setFormData({ ...formData, captcha: '' });

        // fetch a new captcha image
        fetchCaptcha().catch((err) => console.log('Error calling fetchCaptcha: ', err));
    };



    // fetch captcha image
    useEffect(() => {
        fetchCaptcha().catch((err) => console.log('Error calling fetchCaptcha: ', err));

        return () => {
            // revoke the object url to avoid memory leaks
            if (captchaImg) {
                URL.revokeObjectURL(captchaImg);
            }
        };
    }, []);


    // update form data when user types
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // field names must be converted to snake case for django serializer
    const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // clear any previous error
        setErrorMessage('');

        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim() || !formData.captcha.trim()) {
            setErrorMessage('All fields are required');
            return;
        }

        if (formData.password !== passwordConfirm) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const snakeCaseData = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => [camelToSnakeCase(key), value])
            );

            setLoading(true);
            const response = await apiClient.post('/register/', snakeCaseData);

            if (response.status === 201) {
                console.log('User created successfully');
                localStorage.setItem('userToken', response.data.token);
                navigate('/');
            } else {
                // local throw will be caught by catch block below (parent try/catch)
                throw new Error(`Error during user creation, status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error.message || error);
            if (error.response && error.response.status === 400) {
                for (let fieldName in error.response.data) {
                    const fieldErrors = error.response.data[fieldName];
                    for (let err of fieldErrors) {
                        if (err.includes('already exists')) {
                            setErrorMessage(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} ${err}`);
                            return;
                        }
                    }
                }
                setErrorMessage('Bad request, please check your data');
            } else if (error.response && error.response.status === 500) {
                setErrorMessage('Server error, please try again later');
            } else {
                setErrorMessage('Unknown error occurred');
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit} className="padded-container">
                <h1>Signup</h1>
                <h3>Please sign up to make bookings.</h3>
                <h3>You can then use your account to download your media when it is ready.</h3>
                {errorMessage && <p>{errorMessage}</p>}
                <div className="form-container">
                    <div className="form-row">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <div>
                                    <h3>First Name:</h3>
                                    <input className="form-input" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <div>
                                    <h3>Last Name:</h3>
                                    <input className="form-input" type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <div>
                                    <h3>Email:</h3>
                                    <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <div>
                                    <h3>Password:</h3>
                                    <input
                                        className="form-input"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <div>
                                    <h3>Confirm Password:</h3>
                                    <input
                                        className="form-input"
                                        type="password"
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <div className="captcha-group">
                                    {captchaImg && <img src={captchaImg} alt="Captcha" />}
                                    <button className="form-button" type="button" onClick={refreshCaptcha}>
                                        <FontAwesomeIcon icon={faSync} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="full-width padded-container">
                            <div className="form-group">
                                <div>
                                    <h3>Captcha:</h3>
                                    <input
                                        className="form-input"
                                        type="text"
                                        name="captcha"
                                        value={formData.captcha}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-row pegged-right">
                        <div className="form-group">
                            <button className="form-button" type="submit" disabled={loading}>Signup</button>
                        </div>
                    </div>
                </div>


            </form>
        </React.Fragment>
    );
};

export default SignupForm;