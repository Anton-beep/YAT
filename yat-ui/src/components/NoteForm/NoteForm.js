import React, {useState} from 'react';
import Auth from "../../pkg/auth";

function NoteForm({note, closeModal, tags}) {
    console.log(note)
    const [name, setName] = useState(note ? note.name : '');
    const [description, setDescription] = useState(note ? note.description : '');
    const [selectedTags, setSelectedTags] = useState(note ? note.tags : []);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (note) {
            handleEditNote();
        } else {
            handleCreateNote();
        }
    };

    const handleCreateNote = () => {
        if (name === '') {
            setErrorMessage('Введите название заметки');
            return;
        }
        Auth.axiosInstance.post(`/api/v1/homepage/notes/`, {name, description, tags: selectedTags})
            .then((response) => {
                closeModal();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleEditNote = () => {
        Auth.axiosInstance.put(`/api/v1/homepage/notes/`, {id: note.id, name, description, tags: selectedTags})
            .then((response) => {
                closeModal();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteNote = () => {
        Auth.axiosInstance.delete(`/api/v1/homepage/notes/`, {data: {id: note.id}})
            .then((response) => {
                closeModal();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleTagChange = (event) => {
        const tagId = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedTags([...selectedTags, tagId]);
        } else {
            setSelectedTags(selectedTags.filter(id => id !== tagId));
        }
        console.log(selectedTags);
    };

    return (<form onSubmit={handleSubmit} className="task-form">
            <h4>{note ? 'Изменить задачу' : 'Создать задачу'}</h4>
            <div className="mb-3">
                <label className="form-label">Название заметки</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                       required
                       className="form-control"/>
            </div>
            <div className="mb-3">
                <label className="form-label">Текст заметки</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                          className="form-control"/>
            </div>
            <div className="mb-3">
                <label htmlFor="tags" className="form-label">Теги:</label>
                {tags.filter(tag => tag.visible).map(tag => (<div key={tag.id}>
                    <input value={tag.id} className="form-check-input" type="checkbox"
                           onChange={handleTagChange} checked={selectedTags.includes(tag.id)}/>
                    <label className="form-check-label">{tag.name}</label>
                </div>))}
            </div>
            <button type="submit" className="button-green button-gap">Сохранить</button>
            {note && <button type="button" onClick={handleDeleteNote} className="button-red">Удалить заметку</button>}
            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
        </form>);
}

export default NoteForm;