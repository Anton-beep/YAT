import React, {useState} from 'react';
import styles from './ForgotPasswordForm.module.css';
import Layout from "../Layout";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Here you should implement the logic to handle the password reset request
    };

    return (
        <Layout>
            <div className={styles.container}>
                <h1>Забыл пароль</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Почта:
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                        </label>
                    </div>
                    <div>
                        <button type="submit">Отправить ссылку восстановления</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPasswordForm;