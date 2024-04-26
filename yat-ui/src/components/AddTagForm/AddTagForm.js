import React, {useEffect, useState} from 'react';
import Auth from '../../pkg/auth';

const AddTagForm = ({tag = null, onClose}) => {
    const [name, setName] = useState(tag ? tag.name : '');

    useEffect(() => {
        if (tag) {
            setName(tag.name);
        }
    }, [tag]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (tag) {
            Auth.axiosInstance.put(`/api/v1/homepage/tags/`, {id: tag.id, name: name})
                .then(() => {
                    onClose();
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            // If tag is not provided, create a new tag
            Auth.axiosInstance.post('/api/v1/homepage/tags/', {name})
                .then(() => {
                    onClose();
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const handleDelete = () => {
        // Send a DELETE request to the server to delete the tag
        Auth.axiosInstance.delete(`/api/v1/homepage/tags/`, {data: {id: tag.id}})
            .then(() => {
                onClose();
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (<form onSubmit={handleSubmit}>
            <div className="form-group">
                {tag ? <h1 className="list-title">Редактировать тег</h1> : <h1 className="list-title">Добавить тег</h1>}
                <label htmlFor="name">Имя тега</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-control"
                    required
                />
            </div>
            <button type="submit" className="button-green button-gap">Сохранить</button>
            {tag && <button type="button" className="button-red button-gap" onClick={handleDelete}>Удалить</button>}
            <button type="button" className="button-orange" onClick={onClose}>Назад</button>
        </form>);
};

export default AddTagForm;