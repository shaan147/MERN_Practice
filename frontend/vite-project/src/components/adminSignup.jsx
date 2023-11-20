import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlashMessage from 'react-flash-message';

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
    <>
      <h1>Admin Signup</h1>
      <form>
        <label>
          Username:
          <input type="text" placeholder='Enter Your Email' name="username" value={adminData.username} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={adminData.password} onChange={handleInputChange} />
        </label>
        <br />
        <button type="button" onClick={handleSignup}>
          Sign Up
        </button>

        <FlashMessage duration={5000} persistOnHover={true}>
          <div id="flash-message-container"></div>
        </FlashMessage>
      </form>
    </>
  );
};

export default AdminSignup;
