import React, { useState } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import './AddUser.css';

const AddUser = (user) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: user.target,
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/api/v1/users', formData);
      if (response.status === 200) {
        toast.success(`${user.target} added successfully!`);
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      toast.error(`${user.target} cannot be added!`);
    }
  };

  return (
    <div className='container mt-5 my-5 accHoldContainer'>
      <div className="row">
        <div className="col-md-12 text-center">
          <h1>Add {user.target}</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-7 mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button id='addBtn' type="submit" className="btn btn-primary">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
