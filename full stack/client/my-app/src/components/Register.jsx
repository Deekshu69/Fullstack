import React, { useContext, useState } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Register = ({ setAuthType }) => {
  const { setUsername, setEmail, setPassword, register } = useContext(GeneralContext);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register();
      console.log('Registration successful');
      // Optionally redirect or show success message
    } catch (error) {
      console.error('Error during registration:', error);
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <form className="authForm">
      <h2>Register</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="form-floating mb-3 authFormInputs">
        <input
          type="text"
          className="form-control"
          id="floatingInput"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="floatingInput">Username</label>
      </div>
      <div className="form-floating mb-3 authFormInputs">
        <input
          type="email"
          className="form-control"
          id="floatingEmail"
          placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="floatingEmail">Email address</label>
      </div>
      <div className="form-floating mb-3 authFormInputs">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <button className="btn btn-primary" onClick={handleRegister}>
        Sign up
      </button>
      <p>
        Already registered? <span onClick={() => setAuthType('login')}>Login</span>
      </p>
    </form>
  );
};

export default Register;