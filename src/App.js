import React, { Component } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { HomePage } from './components/HomePage';
import { AuctionPage } from './components/AuctionPage';
import './App.css';


const intialState = {
    route: 'login',
	auctionId: 0,
	firstname: '',
	lastname: '',
	username: '',
	personalNumber: '',
	bidCount: 0,
	jwt: ''
};

class App extends Component {
	constructor() {
		super();
		this.state = intialState;
	};

	loadUser = (data) => {
        this.setState({
			firstname: data.userInfo.firstname,
			lastname: data.userInfo.lastname,
			username: data.userInfo.username,
			personalNumber: data.userInfo.personalNumber,
			bidCount: data.userInfo.bidCount,
			jwt: data.jwt
        })
    };
	
	onRouteChange = (route) => {
        this.setState({ route: route });
	};

	onInputChange = (event) => {
        this.setState({ input: event.target.value });
	};

	onAuctionClicked = (auctionId) => {
        this.setState({ auctionId: auctionId });

		this.onRouteChange('auction')
	};

	render() {
		const { route } = this.state;
		return (
			<div className="App">
				{
					route === 'login' ?
						<Login loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
					:
					route === 'register' ?
						<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
					:
					route === 'home' ?
						<HomePage state={this.state} onRouteChange={this.onRouteChange} onAuctionClicked={this.onAuctionClicked} />
					:
					route === 'auction' ?
						<AuctionPage state={this.state} onRouteChange={this.onRouteChange} onAuctionClicked={this.onAuctionClicked} />
					:
					<></>
				}
			</div>
		);
	}
}

export default App;
