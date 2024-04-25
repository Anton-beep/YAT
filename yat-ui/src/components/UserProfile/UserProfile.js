import React, {useEffect, useState} from 'react';
import Auth from "../../pkg/auth";
import Layout from "../Layout";
import styles from './UserProfile.module.css';

function UserProfile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [currentUser, setCurrentUser] = useState({firstName: null, lastName: null, email: null})
    const [errorMessage, setErrorMessage] = useState('');

    const validatePassword = (password) => {
        // Password must be at least 8 characters long, contain at least one number and one letter
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/users/user/')
            .then(response => {
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
                setEmail(response.data.email);
                setCurrentUser({
                    firstName: response.data.first_name,
                    lastName: response.data.last_name,
                    email: response.data.email
                })
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validatePassword(password)) {
            setErrorMessage("Пароль должен быть не менее 8 символов и содержать хотя бы одну букву и одну цифру");
            return;
        }

        const data = {};

        if (password !== '' && confirmPassword === '') {
            setErrorMessage('Подтвердите пароль')
        }
        if (password !== '' && password !== confirmPassword) {
            setErrorMessage('Пароли не совпадают');
        }

        if (currentUser.firstName !== firstName) {
            data.first_name = firstName;
        }
        if (currentUser.lastName !== lastName) {
            data.last_name = lastName;
        }
        if (currentUser.email !== email) {
            data.email = email;
        }

        console.log(data);
        Auth.axiosInstance.put('/api/v1/users/settings/', data).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit} className={styles.container}>
                <label>
                    Имя
                    <input type="text" value={firstName} onChange={handleFirstNameChange}/>
                </label>
                <label>
                    Фамилия
                    <input type="text" value={lastName} onChange={handleLastNameChange}/>
                </label>
                <label>
                    Пароль
                    <input type="password" value={password} onChange={handlePasswordChange}/>
                </label>
                <label>
                    Подтверждение пароля
                    <input type="password" value={confirmPassword}
                           onChange={handleConfirmPasswordChange}/>
                </label>
                <label>
                    Почта
                    <input type="email" value={email} onChange={handleEmailChange}/>
                </label>
                <button type="submit">Сохранить</button>
                {errorMessage !== '' ? <div className="alert alert-danger">{errorMessage}</div> : null}
            </form>
        </Layout>
    );
}

export default UserProfile;