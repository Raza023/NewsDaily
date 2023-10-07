import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiTwotoneDelete } from 'react-icons/ai';
import Pagination from "https://cdn.skypack.dev/rc-pagination@3.1.15";
import { toast, ToastContainer } from 'react-toastify';
const PendingComments = () => {
    const [pendingComments, setPendingComments] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    useEffect(() => {
        loadPendingComments();
    }, [current, size]);

    const loadPendingComments = async () => {
        try {
            const response = await axios.get('/api/v1/comments/user-pending-comments');
            if (Array.isArray(response.data)) {
                setPendingComments(response.data);
                // console.log(pendingComments)
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

    const deleteComment = async (id) => {
        try {
            await axios.delete(`/api/v1/comments/${id}`);
            loadPendingComments();
            toast.success('Deleted successfully!');
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Error deleting');
        }
    };

    
    //   const getData = () => {
    //     return newsArticles.slice((current - 1) * size, current * size);
    //   };

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
                                        total={pendingComments.length} // Use the filtered data length as total count
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
                                                <th>#</th>
                                                <th>Content</th>
                                                <th>postedAt</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingComments.map((comment, index) => (
                                                <tr key={comment.id}>
                                                    <td>{comment.id}</td>
                                                    <td>{comment.content}</td>
                                                    <td>{comment.postedAt}</td>
                                                    <td>
                                                        <button className='btn' onClick={() => deleteComment(comment.id)}>
                                                            <h4><AiTwotoneDelete /></h4>
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
                                        total={pendingComments.length}
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

export default PendingComments;