import React, { useState } from 'react';
import Auth from "../../pkg/auth";

const AddFactorForm = () => {
    const [name, setName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        Auth.axiosInstance.post('api/v1/homepage/factors/', {
            name: name
        }).then(() => {
            setName('');
            window.location.reload();
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div>
            <h2 className="mt-3">Добавить фактор</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Название:</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Отправить</button>
            </form>
        </div>
    );
};

export default AddFactorForm;
