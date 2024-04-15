import React, {useState} from 'react';
import styles from './Restoration.module.css';
import Layout from "../Layout";

const Restoration = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Here you should implement the logic to handle the password restoration
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
                </form>
            </div>
        </Layout>
    );
};

export default Restoration;