import React, { useState } from 'react';
import Auth from '../pkg/auth';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await Auth.register({email: email, password: password, first_name: firstName, last_name: lastName}); // Include first and last names in the registration request
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                First Name:
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required /> {/* New input field for first name */}
            </label>
            <label>
                Last Name:
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required /> {/* New input field for last name */}
            </label>
            <label>
                Email:
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;