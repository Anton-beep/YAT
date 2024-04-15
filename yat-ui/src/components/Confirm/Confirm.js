import React, {useEffect, useState} from 'react';
import Auth from '../../pkg/auth';
import Layout from "./../Layout";
import {useParams} from "react-router-dom";


const Confirm = () => {
    const {token, email} = useParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        Auth.confirm(
            token,
            email
        ).then(
            response => {
                if (response.data) {
                    setMessage("Почта успешно подтверждена");
                    setError(false);
                }
            }
        ).catch(
            error => {
                setMessage("Ошибка подтверждения почты");
                setError(true);
                console.error(error);
            }
        )
    }, []);

    return (
        <Layout>
            <div className="container">
                <h1>Подтверждение почты</h1>
                {message === "" ? null : <div className={error ? "alert alert-danger" : "alert alert-success"}>
                    {message}
                </div>}
            </div>
        </Layout>
    );
};

export default Confirm;