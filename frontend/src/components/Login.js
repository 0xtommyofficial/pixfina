import React, { useState } from 'react';
import apiClient from './apiClient';
import useCheckLogin from './useCheckLogin';

const Login = ({ onSuccess }) => {
  const isLoggedIn = useCheckLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // clear any previous error
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/login/', { email, password });

      if (response.status === 200) {
        // save token and handle login state
        localStorage.setItem('userToken', response.data.token);
        window.dispatchEvent(new Event('login'));

        // call onSuccess callback
        if (onSuccess) onSuccess();
      } else {
        // handle server errors
        setError('Failed to login. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);

      // handle error based on server response
      if (error.response && error.response.data && error.response.data.detail) {
        setError(`Login Error: ${error.response.data.detail}`);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // If the user is already logged in, we can display a message
  if (isLoggedIn) {
    return <p>You are already logged in.</p>;
  }

  return (
      <React.Fragment>
        <h2>Login</h2>
        {error && <p>{error}</p>} {/* display error message */}
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
          <button type="submit" disabled={loading}>Login</button>
        </form>
      </React.Fragment>
  );
};

export default Login;
