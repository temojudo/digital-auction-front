import React, { Component } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { HomePage } from './components/HomePage';
import './App.css';


const intialState = {
    route: 'login',
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
						<HomePage state={this.state} onRouteChange={this.onRouteChange} />
					:
					<></>
				}
			</div>
		);
	}
}

export default App;
