import React, {useState} from 'react';
import Auth from '../../pkg/auth';
import Layout from "./../Layout";
import styles from './LoginForm.module.css'; // Import the CSS file


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
            <form onSubmit={handleSubmit} className={styles.container}>
                <h1>Вход</h1>
                <div>
                    Почта:
                    <label>
                        <input type="text" value={email} onChange={e => setEmail(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <label>
                        Пароль:
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <a href="/forgotpassword">Забыл пароль</a>
                </div>
                <div>
                    <button type="submit">Войти</button>
                </div>
            </form>
        </Layout>
    );
};

export default LoginForm;