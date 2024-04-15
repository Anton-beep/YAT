import React, {useState} from 'react';
import styles from './ForgotPasswordForm.module.css';
import Layout from "../Layout";
import Auth from "../../pkg/auth";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        Auth.forgotPassword(email)
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit} className={styles.container}>
                <h1>Забыл пароль</h1>
                <div>
                    <label>
                        Почта:
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <button type="submit">Отправить ссылку восстановления</button>
                </div>
                {message === "" ? null : <div className={error ? "alert alert-danger" : "alert alert-success"}>
                    {message}
                </div>}
            </form>
        </Layout>
    );
};

export default ForgotPasswordForm;