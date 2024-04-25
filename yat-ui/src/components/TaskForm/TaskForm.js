import React, {useState} from 'react';
import Auth from "../../pkg/auth";

function TaskForm({task, tags = [], closeModal}) {
    const [name, setName] = useState(task ? task.name : '');
    const [description, setDescription] = useState(task ? task.description : '');
    const [selectedTags, setSelectedTags] = useState(task ? task.tags : []);
    const [deadline, setDeadline] = useState(task ? convertUTCToLocalTime(task.deadline) : '');
    const [errorMessage, setErrorMessage] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleTagChange = (event) => {
        const tagId = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedTags([...selectedTags, tagId]);
        } else {
            setSelectedTags(selectedTags.filter(id => id !== tagId));
        }
    };

    const handleDeadlineChange = (event) => {
        setDeadline(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (name === '') {
            setErrorMessage('Введите название задачи');
            return;
        }

        const data = {
            name,
            description,
            tags: selectedTags,
        };

        if (deadline !== null && deadline !== '') {
            data.deadline = Date.parse(deadline.toString()) / 1000;
        }

        const request = task ?
            Auth.axiosInstance.put(`/api/v1/homepage/tasks/`, {...data, id: task.id}) :
            Auth.axiosInstance.post(`/api/v1/homepage/tasks/`, data);
        request
            .then((response) => {
                closeModal();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDelete = () => {
        if (task) {
            Auth.axiosInstance.delete(`/api/v1/homepage/tasks/`, {data: {id: task.id}})
                .then((response) => {
                    closeModal();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleComplete = () => {
        if (task) {
            let putTask = task;
            delete putTask.deadline;

            const updatedTask = {...putTask, status: task.status === 'done' ? 'not done' : 'done'};
            Auth.axiosInstance.put(`/api/v1/homepage/tasks/`, updatedTask)
                .then((response) => {
                    closeModal();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    function convertUTCToLocalTime(utcTimestamp) {
        // Convert the UTC timestamp from seconds to milliseconds
        const date = new Date(utcTimestamp * 1000);
        // Format the date to a string in the 'YYYY-MM-DDTHH:mm' format
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const localTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        return localTime;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h4>{task ? 'Редактировать задачу' : 'Создать задачу'}</h4>
                <div className="mb-3">
                    <label className="form-label">Название</label>
                    <input type="text" value={name} onChange={handleNameChange} className="form-control" required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Описание</label>
                    <textarea value={description} onChange={handleDescriptionChange} className="form-control"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Теги</label>
                    {tags.map((tag) => (
                        <div key={tag.id} className="form-check">
                            <input
                                type="checkbox"
                                value={tag.id}
                                checked={selectedTags.includes(tag.id)}
                                onChange={handleTagChange}
                                className="form-check-input"
                            />
                            <label className="form-check-label">{tag.name}</label>
                        </div>
                    ))}
                </div>
                <div className="mb-3">
                    <label className="form-label">Дедлайн</label>
                    <input type="datetime-local"
                           value={deadline}
                           onChange={handleDeadlineChange} className="form-control"/>
                </div>
                {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                <button type="submit" className="button-green button-gap">Сохранить</button>
                <button type="button" onClick={handleComplete} className="button-light-blue button-gap">
                    {task && task.status === 'done' ? 'Отметить как незавершенное' : 'Завершить'}
                </button>
                {task &&
                    <button type="button" onClick={handleDelete} className="button-red button-gap">Удалить</button>}
                <button type="button" className="button-orange" onClick={closeModal}>Назад</button>
            </form>
        </div>
    );
}

export default TaskForm;