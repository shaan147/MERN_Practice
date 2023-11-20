import React, { useState } from 'react';
import axios from 'axios';
import FlashMessage from 'react-flash-message';
import "./adminCSS.css";
import 'boxicons';
const AdminLogin = () => {
    const [loginData, setLoginData] = useState({
      username: '',
      password: ''
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setLoginData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    };
  
    const handleLogin = async () => {
      const messageContainer = document.getElementById('flash-message-container');
  
      try {
        const response = await axios.post('http://localhost:3000/admin/login', loginData);
        messageContainer.innerHTML = `<div class="flash-success">${response.data.message}</div>`;
        setLoginData({
          username: '',
          password: ''
        });
      } catch (error) {
        messageContainer.innerHTML = '<div class="flash-error">Login failed. Please check your username and password.</div>';
      }
    };
  
    return (
      <section className="container forms">
        <div className="form login">
          <div className="form-content">
            <header>Login</header>
            <FlashMessage duration={5000} persistOnHover={true}>
              <div id="flash-message-container"></div>
            </FlashMessage>
            <form className="mt-3">
              <div className="field input-field">
                <input
                  type="text"
                  placeholder="Username"
                  className="input"
                  id="username"
                  name="username"
                  value={loginData.username}
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
                  value={loginData.password}
                  onChange={handleInputChange}
                  required
                />
                <i className='bx bx-hide eye-icon'></i>
              </div>
  
              <div className="field button-field">
                <button type="button" onClick={handleLogin}>Login</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  };
  
  export default AdminLogin;