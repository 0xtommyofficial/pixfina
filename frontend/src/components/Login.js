import React, { useState } from 'react';
import apiClient from './apiClient';
import { useNavigate } from 'react-router-dom';
import useRedirectIfLoggedIn from './useRedirectIfLoggedIn';

const Login = () => {
  // if user is already logged in, redirect to landing page
  useRedirectIfLoggedIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('email and password passing to login api: ' + email + password);
      const response = await apiClient.post('/login/', { email, password });
      console.log(response);

      if (response.status === 200) {
        // save token and handle login state in your app
        localStorage.setItem('userToken', response.data.token);

        // navigate to the landing page
        navigate('/landing');
      } else {
        // handle error, e.g., show an error message
      }
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
  );
};

export default Login;