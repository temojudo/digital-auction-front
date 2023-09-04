import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { HomePage } from './components/HomePage';
import { AuctionPage } from './components/AuctionPage';
import { AuctionForm } from './components/AuctionForm';
import './App.css';


const App = () => {
    const navigate = useNavigate();

	const initialUserData = JSON.parse(localStorage.getItem('userData')) || {
		firstname: '',
		lastname: '',
		username: '',
		personalNumber: '',
		bidCount: 0,
		jwt: '',
	};
	const [state, setState] = useState(initialUserData);

	useEffect(() => {
		localStorage.setItem('userData', JSON.stringify(state));
	}, [state]);

	const loadUser = (data) => {
        setState({
			firstname: data.userInfo.firstname,
			lastname: data.userInfo.lastname,
			username: data.userInfo.username,
			personalNumber: data.userInfo.personalNumber,
			bidCount: data.userInfo.bidCount,
			jwt: data.jwt
        });

		navigate('/home');
    };

	const logout = () => {
		setState({
			firstname: '',
			lastname: '',
			username: '',
			personalNumber: '',
			bidCount: 0,
			jwt: '',
		});
		localStorage.removeItem('userData');

		navigate('/');
	};

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Login loadUser={loadUser} />} />
				<Route path="/register" element={<Register loadUser={loadUser} />} />
				<Route path="/home" element={<HomePage state={state} logout={logout} />} />
				<Route path="/auctions/:auctionId" element={<AuctionPage state={state} logout={logout} />} />
				<Route path="/auction-form" element={<AuctionForm state={state} logout={logout} />} />
			</Routes>
		</div>
	);
};

export default App;
