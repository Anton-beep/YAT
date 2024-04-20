import React, {useState} from 'react';
import Auth from '../../pkg/auth';


function TaskForm({tags = []}) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            name,
            description,
            tags: selectedTags,
            deadline: deadline,
            status: "not done",
        };

        Auth.axiosInstance.post('/api/v1/homepage/events/', data)
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleNameOnChange = (event) => {
        setName(event.target.value);
    }

    const handleDeadlineOnChange = (event) => {
        const date = new Date(event.target.value);
        const timestamp = Math.floor(date.getTime() / 1000); // convert to seconds
        setDeadline(timestamp.toString());
    };

    const handleDescriptionOnChange = (event) => {
        setDescription(event.target.value);
    }

    const handleTagChange = (event) => {
        if (event.target.checked) {
            setSelectedTags([...selectedTags, parseInt(event.target.value)]);
        } else {
            setSelectedTags(selectedTags.filter(tagId => tagId !== parseInt(event.target.value)));
        }
    };

    return (<div>
        <form onSubmit={handleSubmit}>
            <h4>Добавить новую задачу</h4>

            <div className="mb-3">
                <label htmlFor="text" className="form-label">Название</label>
                <input className="form-control" id="text"
                          onChange={handleNameOnChange}></input>
            </div>

            <div className="mb-3">
                <label htmlFor="date" className="form-label">Дедлайн</label>
                <input type="date" id="date" className="form-control" onChange={handleDeadlineOnChange}/>
            </div>

            <div className="mb-3">
                <label htmlFor="textarea" className="form-label">Описание</label>
                <textarea className="form-control" id="textarea" rows="2"
                          onChange={handleDescriptionOnChange}></textarea>
            </div>

            <div className="mb-3">
                {tags.map(tag => (<div key={tag.id}>
                    <input value={tag.id} className="form-check-input" type="checkbox" onChange={handleTagChange}/>
                    <label className="form-check-label">{tag.name}</label>
                </div>))}
            </div>

            <button type="submit" className="btn btn-primary">Добавить</button>
        </form>
    </div>);
}

export default TaskForm;













