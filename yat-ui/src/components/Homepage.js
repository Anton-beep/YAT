import React, {useState} from 'react';
import Auth from '../pkg/auth';
import Layout from './Layout';

const Homepage = () => {
    return (
        <Layout>
            <div className="cover-container d-flex h-100 p-3 mx-auto flex-column">
                <main role="main" className="inner cover">
                    <h1 className="cover-heading">Добор пожаловать на главную страницу</h1>
                    <p className="lead">Мы обязательно добавим сюда что-то интересное</p>
                    <p className="lead">
                        <a href="#" className="btn btn-lg btn-secondary">Обязательно</a>
                    </p>
                </main>
            </div>
        </Layout>
    )
};

export default Homepage;