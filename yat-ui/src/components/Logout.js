import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Auth from '../pkg/auth';

const Logout = () => {
    useEffect(() => {
        Auth.logout();
        window.location = '/';
    }, []);

    return (
        <>
        </>
    );
};

export default Logout;