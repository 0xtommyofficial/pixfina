import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './apiClient';
import useCheckLogin from './useCheckLogin';

const Login = ({ onSuccess }) => {
  const navigate = useNavigate();
  const isLoggedIn = useCheckLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // clear any previous error
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

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
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);


  return (
      <React.Fragment>
          <form onSubmit={handleSubmit} className="padded-container">
            <h1>Login</h1>
            <h3>Enter your email and password to login.</h3>
            {error && <p>{error}</p>} {/* display error message */}
            <div className="form-container">
              <div className="form-row">
                <div className="full-width padded-container">
                  <div className="form-group">
                    <div>
                      <h3>Email:</h3>
                      <input
                          className="form-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
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
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                </div>
              <div className="form-row pegged-right">
                <div className="form-group">
                  <button className="form-button" type="submit">Submit</button>
                </div>
              </div>
            </div>
          </form>
      </React.Fragment>
  );
};

export default Login;
