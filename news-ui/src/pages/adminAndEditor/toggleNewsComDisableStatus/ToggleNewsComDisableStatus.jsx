import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Pagination from "https://cdn.skypack.dev/rc-pagination@3.1.15";
import { toast, ToastContainer } from 'react-toastify';
import { BsToggleOn, BsToggleOff } from 'react-icons/bs';
import { Link } from 'react-router-dom';

import './ToggleNewsComDisableStatus.css';

const ToggleNewsComDisableStatus = () => {
	const [newsCom, setNewsCom] = useState([]);
	const [filteredNewsCom, setFilteredNewsCom] = useState([]);
	const [searchInput, setSearchInput] = useState('');
	const [status, setStatus] = useState('all');
	const [perPage, setPerPage] = useState(10);
	const [size, setSize] = useState(perPage);
	const [current, setCurrent] = useState(1);
	const { sectionType } = useParams();
	const isRequesting = useRef(false); // Use a ref to track request state

	useEffect(() => {
		const loadNewsCom = async () => {
			try {
				const response = await axios.get(`/api/v1/${sectionType}/editor`);
				const formattedData = response.data.map((entry) => ({
					...entry,
					formattedDate: formatDate(entry.postedAt),
				}));
				setNewsCom(formattedData);
				setFilteredNewsCom(formattedData);
			} catch (error) {
				console.error('Error fetching search results:', error);
			}
		};

		loadNewsCom();
	}, [current, size, sectionType]);

	useEffect(() => {
		// Filter newsCom based on the status and update filteredNewsCom
		if (status === 'enable') {
			const filtered = newsCom.filter((item) => !item.isDisabled);
			setFilteredNewsCom(filtered);
			setStatus('enable');
		} else if (status === 'disable') {
			const filtered = newsCom.filter((item) => item.isDisabled);
			setFilteredNewsCom(filtered);
			setStatus('disable');
		} else {
			setFilteredNewsCom(newsCom);
		}

		console.log(status)

	}, [status]);

	// ... (the rest of your component remains the same)


	const toggleDisableNews = async (id, isDisabled) => {
		try {
			await axios.put(`/api/v1/${sectionType}/disable/${id}`);
			setFilteredNewsCom((prevNewsCom) =>
				prevNewsCom.map((item) =>
					item.id === id ? { ...item, isDisabled: !isDisabled } : item
				)
			);

			// Show a toast message based on the new status
			if (!isDisabled) {
				//   toast.success(`${sectionType} disabled successfully!`);
			} else {
				//   toast.success(`${sectionType} enabled successfully!`);
			}
			isRequesting.current = false; // Reset request state when request is complete
		} catch (error) {
			console.error('Error toggling:', error);
			toast.error('Error toggling');
		}
	};

	const fetchEnableNewsCom = async () => {
		const filteredNewsCom = newsCom.filter((newsCom) => newsCom.isDisabled === false);
		setFilteredNewsCom(filteredNewsCom);
		setStatus('enable');
	};

	const fetchDisableNewsCom = async () => {
		const filteredNewsCom = newsCom.filter((newsCom) => newsCom.isDisabled === true);
		setFilteredNewsCom(filteredNewsCom);
		setStatus('disable');
	};

	const fetchAllNewsCom = async () => {
		setFilteredNewsCom(newsCom);
		setStatus('all');
	};


	const handleSearchInputChange = (event) => {
		if (event.target.value === '') {
			setFilteredNewsCom(newsCom);
			setStatus('all');
		}
		setSearchInput(event.target.value);
	}

	// const handleSearch = () => {
	//   // Filter accounts based on the search input
	//   const filteredSearchResult = newsCom.filter(newsCom =>
	//     newsCom.content === searchInput
	//   );
	//   setFilteredNewsCom(filteredSearchResult);
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

	const PerPageChange = (value) => {
		setSize(value);
		setCurrent(1);
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
			<div className="container-fluid mt-3 mb-5">
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
									<h1>{sectionType.toUpperCase()}</h1>
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
												<th><i className='toggle-stat-btn' onClick={fetchEnableNewsCom}>Enable</i> /
													<i className='toggle-stat-btn' onClick={fetchDisableNewsCom}>Disable</i> /
													<i className='toggle-stat-btn' onClick={fetchAllNewsCom}>All</i></th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{filteredNewsCom.map((newsCom) => (
												<tr key={filteredNewsCom.id}>
													<td style={{ textDecoration: 'underline' }}><Link to={`/newscom/popup/${'disable'}/${sectionType}/${newsCom.id}`}>{newsCom.id}</Link></td>
													{sectionType && sectionType === 'news' && (
														<td>{newsCom.title}</td>
													)}
													<td>{newsCom.content}</td>
													<td>{newsCom.formattedDate}</td>
													<td>
														<button
															className="btn"
															onClick={() => toggleDisableNews(newsCom.id, newsCom.isDisabled)}
														>
															{newsCom.isDisabled ? (
																<h4>
																	<BsToggleOff />
																</h4>
															) : (
																<h4>
																	<BsToggleOn />
																</h4>
															)}
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
};

export default ToggleNewsComDisableStatus;
