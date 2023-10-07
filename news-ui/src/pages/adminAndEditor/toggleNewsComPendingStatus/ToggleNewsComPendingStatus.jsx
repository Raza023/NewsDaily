import React, { useEffect, useState } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri'
import Pagination from "https://cdn.skypack.dev/rc-pagination@3.1.15";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './ToggleNewsComPendingStatus.css'


const ToggleNewsComPendingStatus = () => {
    const { sectionType } = useParams();
    const [newsCom, setNewsCom] = useState([]);
    const [filteredNewsCom, setFilteredNewsCom] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    const loadNewsCom = async () => {
        try {
            const response = await axios.get(`/api/v1/${sectionType}/pending`);
            if (Array.isArray(response.data)) {
                const formattedData = response.data.map((entry) => ({
                    ...entry,
                    formattedDate: formatDate(entry.postedAt),
                }));
                setNewsCom(formattedData);
                setFilteredNewsCom(formattedData);
            } else {
                console.error('API response is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error loading news articles:', error);
        }
    };


    useEffect(() => {
        loadNewsCom();
    }, [current, size, sectionType]);


    const PerPageChange = (value) => {
        setSize(value);
        setCurrent(1);
    };

    const deleteNewsCom = async (id) => {
        try {
            await axios.delete(`/api/v1/${sectionType}/${id}`);
            loadNewsCom();
            toast.success(`${sectionType} discarded successfully!`);
        } catch (error) {
            console.error('Error discarding:', error);
            toast.error('Error discarding');
        }
    };
    const approveNewsCom = async (id) => {
        try {
            await axios.put(`/api/v1/${sectionType}/approve/${id}`);
            loadNewsCom();
            toast.success(`${sectionType} approved successfully!`);
        } catch (error) {
            console.error('Error approving:', error);
            toast.error('Error approving');
        }
    };

    const handleSearchInputChange = (event) => {
        if (event.target.value === '') {
            setFilteredNewsCom(newsCom);
        }
        setSearchInput(event.target.value);
    }

    // const handleSearch = () => {
    //     const filteredSearchResult = newsCom.filter(newsCom =>
    //         newsCom.id === parseInt(searchInput),
    //     );
    //     setFilteredNewsCom(filteredSearchResult);
    // }

    const handleSearch = () => {
		// Convert searchInput to lowercase for case-insensitive search
		const searchInputLower = searchInput.toLowerCase();

		// Filter accounts based on the search input using String.includes()
		const filteredSearchResult = newsCom.filter(newsCom =>
			newsCom.content.toLowerCase().includes(searchInputLower)
		);

		setFilteredNewsCom(filteredSearchResult);
	}



    const formatDate = (dateString) => {
        try {
            const [year, month, day, hour, minute, second] = dateString.split(/\D/);
            const date = new Date(year, month - 1, day, hour, minute, second);

            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }

            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true, // Use 24-hour format
            };

            const formattedDate = date.toLocaleString(undefined, options);

            return formattedDate;
        } catch (error) {
            console.error('Error parsing date:', error);
            return 'Invalid Date';
        }
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
                                        total={newsCom.length}
                                        current={current}
                                        pageSize={size}
                                        showSizeChanger={false}
                                        itemRender={PrevNextArrow}
                                        onShowSizeChange={PerPageChange}
                                    />
                                </div>
                                <div className="col-md-12 text-center my-3">
                                    <h1>PENDING {sectionType.toUpperCase()}</h1>
                                </div>
                                <div className="input-group mb-3 search-container">
                                    <input
                                        type="text"
                                        className="form-control search-input"
                                        placeholder={`Search by ${sectionType} content`}
                                        value={searchInput}
                                        onChange={handleSearchInputChange}
                                    />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary search-btn" onClick={handleSearch}>Search</button>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-text-small mb-0 text-center">
                                        <thead className="thead-primary table-sorting">
                                            <tr>
                                                <th>#</th>
                                                {sectionType && sectionType === 'news' && (
                                                    <th>title</th>
                                                )}
                                                <th>content</th>
                                                <th>postedAt</th>
                                                <th>Approve</th>
                                                <th>Discard</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredNewsCom.map((newsCom) => (
                                                <tr key={newsCom.id}>
                                                    <td style={{ textDecoration: 'underline' }}><Link to={`/newscom/popup/${'pending'}/${sectionType}/${newsCom.id}`}>{newsCom.id}</Link></td>
                                                    {sectionType && sectionType === 'news' && (
                                                        <td>{newsCom.title}</td>
                                                    )}
                                                    <td>{newsCom.content}</td>
                                                    <td>{newsCom.formattedDate}</td>
                                                    <td>
                                                        <button className='btn' onClick={() => approveNewsCom(newsCom.id)}>
                                                            <h4><BsCheck2Circle /></h4>
                                                        </button>

                                                    </td>
                                                    <td>
                                                        <button className='btn' onClick={() => deleteNewsCom(newsCom.id)}>
                                                            <h4><RiDeleteBin6Line /></h4>
                                                        </button>
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
                                        total={newsCom.length}
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
}

export default ToggleNewsComPendingStatus
