import React from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../pkg/auth';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Auth.logout();
        navigate('/login');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;