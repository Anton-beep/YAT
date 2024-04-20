import React, {useState} from 'react';
import Auth from '../../pkg/auth';
import Layout from "./../Layout";
import styles from './LoginForm.module.css'; // Import the CSS file


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            Auth.login({email: email, password: password})
                .then(
                    response => {
                        if (response.access) {
                            setMessage("Успешный вход");
                            setError(false);
                        }
                        window.location = '/dashboard';
                    }
                )
                .catch(
                    error => {
                        setMessage("Неверный логин или пароль или вы не подтвердили почту");
                        setError(true);
                        console.error(error);
                    }
                )
        } catch (error) {
            setMessage("Неверный логин или пароль");
            setError(true);
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
                {message === "" ? null : <div className={error ? "alert alert-danger" : "alert alert-success"}>
                    {message}
                </div>}
            </form>
        </Layout>
    );
};

export default LoginForm;