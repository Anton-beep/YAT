import React, {useState, useEffect} from 'react';
import Auth from '../pkg/auth';

const SecretPage = () => {
    const [secretMessage, setSecretMessage] = useState('');

    useEffect(() => {
        Auth.axiosInstance.get('http://localhost:8000/api/v1/users/secret/')
            .then(response => {
                setSecretMessage(response.data.message);
            })
            .catch(error => {
            });
    }, []);

    return (
        <div>
            <h1>Secret Page</h1>
            <p>{secretMessage}</p>
        </div>
    );
};

export default SecretPage;