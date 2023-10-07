import React from "react";
import { useState, useEffect } from "react";
import Pagination from "https://cdn.skypack.dev/rc-pagination@3.1.15";
import './SearchUser.css';
import axios from "axios";
import { AiTwotoneEdit } from 'react-icons/ai';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const SearchUser = (passedUser) => {
    const [users, setUsers] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    useEffect(() => {
        loadUsers();
    }, [current, size]);

    const loadUsers = async () => {
        try {
            const response = await axios.get('/api/v1/users');
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.error('API response is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error loading news articles:', error);
        }
    };

    const PerPageChange = (value) => {
        setSize(value);
        setCurrent(1);
    };

    const toggleDisableNews = async (id) => {
        try {
            await axios.put(`/api/v1/users/disable/${id}`);
            loadUsers();
        } catch (error) {
            console.error('Error disabling:', error);
        }
    };

    const getData = () => {
        const filteredUsers = users.filter((user) => user.role === passedUser.target);
        // const totalFilteredUsers = filteredUsers.length; // Total count of filtered users
        return filteredUsers.slice((current - 1) * size, current * size);
    };

    const PaginationChange = (page, pageSize) => {
        setCurrent(page);
        setSize(pageSize);
    };

    const PrevNextArrow = (current, type, originalElement) => {
        if (type === 'prev') {
            return (
                <button>
                    <i className="fa fa-angle-double-left"></i>
                </button>
            );
        }
        if (type === 'next') {
            return (
                <button>
                    <i className="fa fa-angle-double-right"></i>
                </button>
            );
        }
        return originalElement;
    };

    return (
        <>
            <div className="container-fluid mt-5 mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-filter-info">
                                    <Pagination
                                        className="pagination-data"
                                        showTotal={(total, range) =>
                                            `Showing ${range[0]}-${range[1]} of ${total}`
                                        }
                                        onChange={PaginationChange}
                                        total={getData().length} // Use the filtered data length as total count
                                        current={current}
                                        pageSize={size}
                                        showSizeChanger={false}
                                        itemRender={PrevNextArrow}
                                        onShowSizeChange={PerPageChange}
                                    />
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-text-small mb-0 text-center">
                                        <thead className="thead-primary table-sorting">
                                            <tr>
                                                <th>User Id</th>
                                                <th>Username</th>
                                                <th>Password</th>
                                                <th>Email</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getData().map((user) => (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.password}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <Link to={`/editUser/${user.id}`}>
                                                            <button className='btn' >
                                                                <h4><AiTwotoneEdit /></h4>
                                                            </button>
                                                        </Link>
                                                        {passedUser.role === 'EDITOR' && (
                                                            <button
                                                                className="btn"
                                                                onClick={() => toggleDisableNews(user.id, user.isDisabled)}
                                                            >
                                                                {user.isDisabled ? (
                                                                    <h4>
                                                                        <BsToggleOff />
                                                                    </h4>
                                                                ) : (
                                                                    <h4>
                                                                        <BsToggleOn />
                                                                    </h4>
                                                                )}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="table-filter-info">
                                    <Pagination
                                        className="pagination-data"
                                        showTotal={(total, range) =>
                                            `Showing ${range[0]}-${range[1]} of ${total}`
                                        }
                                        onChange={PaginationChange}
                                        total={getData().length} // Use the filtered data length as total count
                                        current={current}
                                        pageSize={size}
                                        showSizeChanger={false}
                                        itemRender={PrevNextArrow}
                                        onShowSizeChange={PerPageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default SearchUser;
