import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import Auth from '../../pkg/auth';
import AddTagForm from '../AddTagForm/AddTagForm';
import '../../App.css';

const TagsList = () => {
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const fetchTags = () => {
        Auth.axiosInstance.get('/api/v1/homepage/tags/')
            .then(response => {
                console.log("tags", response.data)
                setTags(response.data.tags);
            })
            .catch(error => {
                console.error(error);
            })
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const openEditDialog = (tag) => {
        setSelectedTag(tag);
        setIsEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setSelectedTag(null);
        setIsEditDialogOpen(false);
        fetchTags();
    };

    const openAddDialog = () => {
        setIsAddDialogOpen(true);
    };

    const closeAddDialog = () => {
        setIsAddDialogOpen(false);
        fetchTags();
    };

    return (
        <div>
            <div className="header">
                <h1 className="list-title">Теги</h1>
                <button className="button-light-blue button-gap" style={{marginLeft: "10px"}} onClick={openAddDialog}>Добавить тег</button>
            </div>
            <div className="event-container" style={{height: '100%', overflowY: 'auto', boxSizing: 'border-box'}}>
                {tags.filter(tag => tag.visible).map((tag, index) => {
                    return (
                        <div key={tag.id} className="event-card" onClick={() => openEditDialog(tag)}
                             style={{boxSizing: 'border-box'}}>
                            <h2 className="card-event-name">{tag.name}</h2>
                        </div>
                    )
                })}
            </div>
            <Modal isOpen={isEditDialogOpen} onRequestClose={closeEditDialog} style={{
                content: {
                    width: '35%', height: '75%', margin: 'auto',
                }
            }}>
                <AddTagForm tag={selectedTag} onClose={closeEditDialog} />
            </Modal>
            <Modal isOpen={isAddDialogOpen} onRequestClose={closeAddDialog} style={{
                content: {
                    width: '35%', height: '75%', margin: 'auto',
                }
            }}>
                <AddTagForm onClose={closeAddDialog} />
            </Modal>
        </div>
    )
};

export default TagsList;