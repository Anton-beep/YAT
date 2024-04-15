import React, {useState} from 'react';
import Auth from '../../pkg/auth';
import Layout from "./../Layout";
import styles from './RegisterForm.module.css';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
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
                        setMessage("Ошибка регистрации");
                        setError(true);
                        console.error(error);
                    }
                )
        } catch (error) {
            console.error(error);
        }
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
            </form>
        </Layout>
    );
};

export default RegisterForm;