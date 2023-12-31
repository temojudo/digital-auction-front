import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';


export const Login = (props) => {
    const [username, setUsername] = useState('')
    const [pass, setPass] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:8080/users/login', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: pass
            })
        })
        .then(response => {
            if (response.ok) {
                setErrorMessage('')

                response.json()
                    .then(data => {
                        props.loadUser(data);
                        navigate('/home');
                    })
            } if (response.status === 400 || response.status === 403 || response.status === 404) {
                setErrorMessage('Invalid credentials');
            } else {
                setErrorMessage(`error occured status code [${response.status}]`);
            }
        })
    }

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <h3 style={{maxWidth: 300}}>{errorMessage}</h3>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="username" id="username" name="username" required />
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" required />
                <button className="login-register-btn" type="submit">Log In</button>
            </form>
            <button className="link-btn" onClick={() => navigate('/register')}>Don't have an account? Register here.</button>
        </div>
    )
}
