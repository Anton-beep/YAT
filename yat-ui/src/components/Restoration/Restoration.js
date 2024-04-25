import React, {useState} from 'react';
import styles from './Restoration.module.css';
import Layout from "../Layout";
import {useParams} from "react-router-dom";
import Auth from "../../pkg/auth";

const Restoration = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {token} = useParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const validatePassword = (password) => {
        // Password must be at least 8 characters long, contain at least one number and one letter
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validatePassword(password)) {
            setMessage("Пароль должен быть не менее 8 символов и содержать хотя бы одну букву и одну цифру");
            setError(true);
            return;
        }
        Auth.restore(token, password)
            .then(
                response => {
                    if (response.data) {
                        setMessage("Пароль успешно изменен");
                        setError(false);
                    }
                }
            )
            .catch(
                error => {
                    setMessage("Ошибка изменения пароля");
                    setError(true);
                    console.error(error);
                }
            )
    };

    return (
        <Layout>
            <div className={styles.container}>
                <h1>Восстановление пароля</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Новый пароль:
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                   required/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Подвтердите пароль:
                            <input type="password" value={confirmPassword}
                                   onChange={e => setConfirmPassword(e.target.value)} required/>
                        </label>
                    </div>
                    <div>
                        <button type="submit">Поменять пароль</button>
                    </div>
                    {message === "" ? null : <div className={error ? "alert alert-danger" : "alert alert-success"}>
                    {message}
                </div>}
                </form>
            </div>
        </Layout>
    );
};

export default Restoration;