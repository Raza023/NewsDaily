import './lib/css/bootstrap.min.css';
// import './lib/js/bootstrap.min.js';

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// import { Route } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import './App.css';
import AdminAndEditorPanel from './pages/adminAndEditor/panel/AdminAndEditorPanel';
import ReporterPanel from './pages/reporter/panel/ReporterPanel';
import LoginWrapper from './components/login/LoginWrapper';
import Logout from './components/login/Logout';
import UserPanel from './pages/user/panel/UserPanel';

function App() {
	const [user, setUser] = useState({});
	const [targetUser, setTargetUser] = useState(null);

	const [authUser, setAuthUser] = useState(null);
	const [username, setUserName] = useState(null);


	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get('/api/v1/users/user');
				if (response.status === 200) {
					if (response.data.content.role.toUpperCase() === 'ADMIN') {

						setTargetUser('EDITOR');
					}
					else if (response.data.content.role.toUpperCase() === 'EDITOR') {
						setTargetUser('REPORTER');
					}
					setUser(response.data.content);
				} else {
					console.error('Failed to fetch user role');
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};

		const fetchAuthenticatedUserRoles = async () => {
			try {
				const response = await axios.get('/api/v1/users/getAuthenticatedUser');

				if (response.status === 200) {
					setAuthUser(response.data);

					setUserName(response.data.name);
				} else {
					console.error('Failed to fetch authenticated user');
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};
		fetchUser();
		fetchAuthenticatedUserRoles();
	}, []);

	return (
		<Router>
            <Navbar showLogout={authUser !== null} /> {/* Show "Logout" when user is logged in */}
            <Routes>
				<Route path="/login" element={<LoginWrapper /> } />
                <Route path="/logout" element={<Logout /> } /> {/* Use element prop for the /logout route */}
                <Route path="*" element={authUser === null ? (
                    <LoginWrapper username={username} />
                ) : (
                    <p>
                        {user.role === "ADMIN" || user.role === "EDITOR" ? (
                            <AdminAndEditorPanel user = {user} target={targetUser} />
                        ) : user.role === "REPORTER" ? (
                            <ReporterPanel user = {user} />			
                        ) : user.role === "USER" ? (
                            <UserPanel user = {user}/>
                        ) : null}
                    </p>
                )} />
            </Routes>
        </Router>
	);
}

export default App;

