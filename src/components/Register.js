import React, { useState } from "react"


export const Register = (props) => {
    const [username, setUsername] = useState('')
    const [pass, setPass] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [personalNumber, setPersonalNumber] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:8080/users/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: pass,
                personalNumber: personalNumber
            })
        })
        .then(response => {
            if (response.ok) {
                setErrorMessage('')

                response.json()
                    .then(data => {
                        props.loadUser(data)
                        props.onRouteChange('home')
                    })
            } if (response.status === 400) {
                response.json()
                .then(errors => {
                    console.log('errori moxda')
                    setErrorMessage(`Invalid request ${JSON.stringify(errors)}`)
                })
            } else {
                setErrorMessage(`error occured status code [${response.status}]`)
            }
        })
    }

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
            <h3>{errorMessage}</h3>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="firstname">Firstname</label>
                <input value={firstname} name="firstname" onChange={(e) => setFirstname(e.target.value)} id="firstname" placeholder="firstname" />
                <label htmlFor="lastname">Lastname</label>
                <input value={lastname} name="lastname" onChange={(e) => setLastname(e.target.value)} id="lastname" placeholder="lastname" />
                <label htmlFor="personalNumber">Personal Number</label>
                <input value={personalNumber} name="personalNumber" onChange={(e) => setPersonalNumber(e.target.value)} id="personalNumber" placeholder="personal number" />
                <label htmlFor="username">username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="username" id="username" name="username" />
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Register</button>
            </form>
            <button className="link-btn" onClick={() => props.onRouteChange('login')}>Already have an account? Login here.</button>
        </div>
    )
}
