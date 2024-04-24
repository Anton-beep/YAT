import React, {useEffect, useState} from 'react';
import Auth from "../../pkg/auth";
import Modal from "react-modal";
import NoteForm from "../NoteForm/NoteForm";
import TagsFilter from "../TagsFilter/TagsFilter";
import {ReactComponent as StickyIcon} from '../../icons/sticky.svg';
import {ReactComponent as X} from "../../icons/x-lg.svg";

function NoteList({rerender}) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/tags/')
            .then(response => {
                    const newTags = response.data.tags.map(tag => ({
                        ...tag,
                        id: tag.id,
                        name: tag.name,
                        checked: false,
                    }));
                    setTags(newTags);
                }
            )
            .catch(error => {
                console.error(error);
            })
    }, [rerender.tags]);

    useEffect(() => {
        fetchNotes();
    }, [isFormOpen]);

    const fetchNotes = () => {
        Auth.axiosInstance.get(`/api/v1/homepage/notes/`)
            .then((response) => {
                setNotes(response.data.notes);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleAddNote = () => {
        setIsFormOpen(true);
    };

    return (
        <div style={{border: '1px solid lightgrey', borderRadius: '10px', marginRight: '10px'}}>
            <div className="header">
                <h2 style={{marginTop: '10px'}}>Заметки</h2>
            </div>

            <div className="buttons">
                <button className="button-green button-gap" onClick={handleAddNote}>Добавить заметку</button>
                <button className="button-orange button-gap" onClick={() => setIsFilterOpen(true)}>Фильтр по тегам</button>
                {Boolean(selectedTags.length !== 0) && <button className="button-orange button-gap" onClick={() => {
                    setSelectedTags([]);
                    setTags(tags.map(tag => ({...tag, checked: false})));
                }}>
                    {tags.filter(tag => tag.checked).map(tag => tag.name).join(', ')}
                    <X fill="red"/>
                </button>}
            </div>

            <Modal
                isOpen={isFormOpen}
                onRequestClose={() => {
                    setSelectedNote(null);
                    setIsFormOpen(false)
                }}
                style={{
                    content: {
                        width: '40%',
                        height: '80%',
                        margin: 'auto',
                    }
                }}
            >
                <NoteForm closeModal={() => {
                    setSelectedNote(null);
                    setIsFormOpen(false)
                }} note={selectedNote} tags={tags}/>
            </Modal>

            <Modal
                isOpen={isFilterOpen}
                onRequestClose={() => setIsFilterOpen(false)}
                style={{
                    content: {
                        width: '40%',
                        height: '80%',
                        margin: 'auto',
                    }
                }}
            >
                <TagsFilter tags={tags} onTagSelection={setSelectedTags} oldSelectedTags={selectedTags} closeModal={() => setIsFilterOpen(false)}/>
            </Modal>

            <div className="note-list">
                {notes.filter(note => selectedTags.length === 0 || selectedTags.every(tag => note.tags.includes(tag))).map(note => (
                        <div key={note.id} className="event-card" onClick={() => {
                            setSelectedNote(note);
                            setIsFormOpen(true);
                        }}>
                            <div className="text-with-icon">
                                <StickyIcon className="icon-fixed-size"/>
                                <h4>{note.name}</h4>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default NoteList;