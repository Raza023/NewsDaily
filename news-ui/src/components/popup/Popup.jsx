import React, { useEffect, useState } from 'react'
import './Popup.css'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Popup = () => {
    const { status, sectionType, id } = useParams();
    const [newsCom, setNewsCom] = useState([]);

    const showNewsCom = async () => {
        try {
            if (sectionType === 'news') {
                var response = await axios.get(`/api/v1/${sectionType}/${id}`);
            }
            else {
                var response = await axios.get(`/api/v1/news/newsByComment/${id}`);
            }
            setNewsCom(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        showNewsCom();
    }, []);

    return (
        <div className='popup'>
            <div className='popup_inner'>
                <div className='popup_header'>
                    <h1 className='popupH1'>{sectionType}</h1>
                    <Link to={`/newscom/${status}/${sectionType}`}>
                        <button className='close_btn'>X</button>
                    </Link>
                </div>
                <div className='popup_body'>
                    <div className='popup_body_right'>
                        <h2 className='popupH2'>{newsCom.title}</h2>
                        <p className='popupPara'>{newsCom.content}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Popup


