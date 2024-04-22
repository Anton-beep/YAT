import React, { useState, useEffect } from 'react';
import Auth from "../../pkg/auth";

const AddFactorForm = ({ factor = null, onClose }) => {
    const [name, setName] = useState(factor ? factor.name : '');
    const [editMode, setEditMode] = useState(!!factor);

    useEffect(() => {
        if (factor) {
            setName(factor.name);
            setEditMode(true);
        } else {
            setName('');
            setEditMode(false);
        }
    }, [factor]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (editMode) {
            Auth.axiosInstance.put(`/api/v1/homepage/factors/`, { id: factor.id, name: name })
                .then(() => {
                    onClose();
                }).catch((error) => {
                console.error(error);
            });
        } else {
            Auth.axiosInstance.post('api/v1/homepage/factors/', {name})
                .then(() => {
                    onClose();
                }).catch((error) => {
                console.error(error);
            });
        }
    };

    const handleDelete = () => {
        Auth.axiosInstance.delete(`/api/v1/homepage/factors/`, { data: { id: factor.id } })
            .then(() => {
                onClose();
            }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div>
            <h2 className="mt-3">{editMode ? 'Edit Factor' : 'Add Factor'}</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Submit'}</button>
                {editMode && <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>}
            </form>
        </div>
    );
};

export default AddFactorForm;