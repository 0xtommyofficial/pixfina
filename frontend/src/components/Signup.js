import React, { useState, useEffect } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import apiClient from './apiClient';
import useRedirectIfLoggedIn from './useRedirectIfLoggedIn';

const SignupForm = () => {

  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
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

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('All fields are required');
      return;
    }

    if (formData.password !== passwordConfirm) {
      setErrorMessage('Passwords do not match');
      return;
    }

    let recaptchaToken;
    try {
      recaptchaToken = await executeRecaptcha('signup');
    } catch (error) {
      console.error('Recaptcha execution failed:', error);
      return;
    }

    try {
      const snakeCaseData = Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [camelToSnakeCase(key), value])
      );
      const requestData = { ...snakeCaseData, captcha: recaptchaToken };

      setLoading(true);
      const response = await apiClient.post('/register/', requestData);

      if (response.status === 201) {
        console.log('User created successfully');
        localStorage.setItem('userToken', response.data.token);
        // useRedirectIfLoggedIn() will redirect to landing page if user is logged in
      } else {
        // local throw will be caught by catch block below (parent try/catch)
        throw new Error(`Error during user creation, status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error.message || error);
      if (error.response && error.response.status === 400) {
        setErrorMessage('Bad request, please check your data');
      } else if (error.response && error.response.status === 500) {
        setErrorMessage('Server error, please try again later');
      } else {
        setErrorMessage('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <React.Fragment>
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
          <button type="submit" disabled={loading}>Signup</button>
        </form>
      </React.Fragment>
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