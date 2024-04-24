import React, {useState} from 'react';
import Auth from '../../pkg/auth';
import Layout from "./../Layout";
import styles from './RegisterForm.module.css';
import Loading from "./../Loading/Loading";

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const validatePassword = (password) => {
        // Password must be at least 8 characters long, contain at least one number and one letter
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        if (!validatePassword(password)) {
            setMessage("Пароль должен быть не менее 8 символов и содержать хотя бы одну букву и одну цифру");
            setError(true);
            return;
        }
        try {
            Auth.register({email: email, password: password, first_name: firstName, last_name: lastName})
                .then(
                    response => {
                        if (response.data) {
                            setMessage("Успешная регистрация, подтвердите почту перейдя по ссылке в письме");
                            setError(false);
                        }
                    }
                )
                .catch(
                    error => {
                        if (error.response === undefined) {
                            setMessage("Ошибка сервера, попробуйте позже");
                            setError(true);
                            console.error(error);
                            setLoading(false);
                            return;
                        }
                        setMessage(Object.values(error.response.data).join(", "));
                        setError(true);
                        console.error(error);
                    }
                )
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit} className={styles.container}>
                <h1>Регистрация</h1>
                <div>
                    <label>
                        Имя:
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                               required/>
                    </label>
                </div>
                <div>
                    <label>
                        Фамилия:
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                               required/>
                    </label>
                </div>
                <div>
                    <label>
                        Почта:
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <label>
                        Пароль:
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <button type="submit">Зарегестрироваться</button>
                </div>
                {message === "" ? null : <div className={error ? "alert alert-danger" : "alert alert-success"}>
                    {message}
                </div>}
                {loading ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Loading/></div> : null}
            </form>
        </Layout>
    );
};

export default RegisterForm;