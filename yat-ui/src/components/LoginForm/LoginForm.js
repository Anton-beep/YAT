import React, {useState} from 'react';
import Auth from '../../pkg/auth';
import Layout from "./../Layout";
import './LoginForm.css'; // Import the CSS file

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await Auth.login({email: email, password: password});
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit} className="container">
                <div>
                    <label>
                        Email:
                        <input type="text" value={email} onChange={e => setEmail(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </Layout>
    );
};

export default LoginForm;