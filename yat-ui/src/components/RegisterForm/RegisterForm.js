import React, {useState} from 'react';
import Auth from '../../pkg/auth';
import Layout from "./../Layout";
import './RegisterForm.css'; // Import the CSS file

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
        <Layout>
            <form onSubmit={handleSubmit} className="container">
                <div>
                    <label>
                        First Name:
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                               required/> {/* New input field for first name */}
                    </label>
                </div>
                <div>
                    <label>
                        Last Name:
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                               required/> {/* New input field for last name */}
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
        </Layout>
    );
};

export default RegisterForm;