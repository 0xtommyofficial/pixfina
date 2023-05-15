import React, { useState } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useNavigate } from 'react-router-dom';
import apiClient from './apiClient';
import useRedirectIfLoggedIn from './useRedirectIfLoggedIn';

const SignupForm = () => {
  // if user is already logged in, redirect to landing page
  useRedirectIfLoggedIn();

  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // field names must be converted to pythonic naming for django User model serializer
  const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== passwordConfirm) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha('signup');
      const snakeCaseData = Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [camelToSnakeCase(key), value])
      );
      const requestData = { ...snakeCaseData, captcha: recaptchaToken };
      const response = await apiClient.post('/register/', requestData);

      if (response.status === 201) {
        console.log('User created successfully');
        localStorage.setItem('userToken', response.data.token);
        navigate('/landing');
      } else {
        console.log('Error during user creation');
      }
    } catch (error) {
      console.error('Error:', error.message || error);
    }
  };


  return (
      <div>
        <h2>Signup</h2>
        {errorMessage && <p>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <button type="submit">Signup</button>
        </form>
      </div>
  );
};

const Signup = () => {
  return (
      <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_KEY}>
        <SignupForm />
      </GoogleReCaptchaProvider>
  );
};

export default Signup;