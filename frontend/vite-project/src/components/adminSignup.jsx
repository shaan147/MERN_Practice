import React, { useState } from 'react';
import axios from 'axios';
import FlashMessage from 'react-flash-message';
import "./adminCSS.css";
const AdminSignup = () => {
  const [adminData, setAdminData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const isValidEmail = (username) => {
    // Email validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(username);
  };

  const handleSignup = async () => {
    const messageContainer = document.getElementById('flash-message-container');

    if (!isValidEmail(adminData.username)) {
      messageContainer.innerHTML = '<div class="flash-error">Invalid Email Address</div>';
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/admin/signup', adminData);
      messageContainer.innerHTML = `<div class="flash-success">${response.data.message}</div>`;
      setAdminData({
        username: '',
        password: ''
      });
    } catch (error) {
      messageContainer.innerHTML = '<div class="flash-error">Signup failed. Please try again.</div>';
    }
  };

  return (
    <section className="container forms">
      <div className="form login">
        <div className="form-content">
          <header>Signup</header>
          <FlashMessage duration={5000} persistOnHover={true}>
            <div id="flash-message-container"></div>
          </FlashMessage>
          <form  className="mt-3">
            <div className="field input-field">
              <input
                type="text"
                placeholder="Username"
                className="input"
                id="username"
                name="username"
                value={adminData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="field input-field">
              <input
                type="password"
                placeholder="Password"
                className="password"
                id="password"
                name="password"
                value={adminData.password}
                onChange={handleInputChange}
                required
              />
              <i className='bx bx-hide eye-icon'></i>
            </div>

            <div className="field button-field">
              <button type="button" onClick={handleSignup}>Signup</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminSignup;
