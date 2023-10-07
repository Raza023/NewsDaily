import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'
import './EditUser.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const EditUser = (user) => {
  const {userId} = useParams();
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [User, setUser] = useState({
    username: '',
    password: '',
    email: '',
  });

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const fetchUser = async () => {
    const result = await axios.get(`/api/v1/users/${userId}`);
    setUser(result.data.content);
    };

  const handleCancel = () => {
    navigate("/searchUser");
  };



  useEffect(() => {
    fetchUser();
    }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/v1/users/${userId}`, User);
      if (response.status === 200) {
        toast.success(`${user.target}: @_${username} updated successfully!`)
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  };

  return (
    <div className='container mt-5 my-5 updAccHoldContainer'>
      <div className="row">
        <div className="col-md-12 text-center">
          <h1>Update {user.target}</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-7 mx-auto">
          <div className="mb-3">
            <label htmlFor="userId" className="form-label">User Id</label>
            <input
              type="number"
              className="form-control"
              id="userId"
              name="userId"
              value={userId}
              onChange={handleChange}
              readOnly
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={User.username}
                onChange={(e) => setUser({ ...User, username: e.target.value })}
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
                value={User.email}
                onChange={(e) => setUser({ ...User, email: e.target.value })}
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
                value={User.password}
                onChange={(e) => setUser({ ...User, password: e.target.value })}
                required
                readOnly
              />
            </div>
            <button type="submit" className="btn btn-primary btns">Update</button>
            <button className="btn btn-danger mx-2" onClick={handleCancel}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;