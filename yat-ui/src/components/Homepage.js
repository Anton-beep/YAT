import React, {useEffect, useState} from 'react';
import Auth from '../pkg/auth';
import Layout from './Layout';
import About from './About/About';

const Homepage = () => {
    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/users/user/')
            .then(response => {
                if (response.data.email !== "") {
                    window.location.href = '/dashboard';
                }
            })
            .catch(() => {
            });
    }, []);

    return (
        <Layout>
            <About />
        </Layout>
    )
};

export default Homepage;