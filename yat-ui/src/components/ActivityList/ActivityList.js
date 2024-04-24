import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import Auth from '../../pkg/auth';
import {ReactComponent as Bib} from '../../icons/bib.svg';
import {ReactComponent as Bob} from '../../icons/bob.svg';
import AddFactorForm from '../AddFactorForm/AddFactorForm';
import '../../App.css';
import AddActivityForm from "../AddActivityForm/AddActivityForm";

const iconComponents = {
    "bib.svg": Bib,
    "bob.svg": Bob,
};

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const fetchActivity = () => {
        Auth.axiosInstance.get('/api/v1/homepage/activities/')
            .then(response => {
                setActivities(response.data.activities);
            })
            .catch(error => {
                console.error(error);
            })
    };

    useEffect(() => {
        fetchActivity();
    }, [isAddDialogOpen, selectedActivities]);

    const openEditDialog = (activity) => {
        setSelectedActivities(activity);
        setIsEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setSelectedActivities(null);
        setIsEditDialogOpen(false);
    };

    const openAddDialog = () => {
        setIsAddDialogOpen(true);
    };

    const closeAddDialog = () => {
        setIsAddDialogOpen(false);
    };

    return (
        <div>
            <div className="header">
                <h1 className="list-title">Активности</h1>
                <button className="button-light-blue button-gap" style={{marginLeft: "10px"}} onClick={openAddDialog}>Добавить активность</button>
            </div>
            <div className="event-container" style={{height: '100%', overflowY: 'auto', boxSizing: 'border-box'}}>
                {activities.filter(activity => activity.visible).map((activity, index) => {
                    const IconComponent = iconComponents[activity.icon.name];
                    return (
                        <div key={activity.id} className="event-card" onClick={() => openEditDialog(activity)}
                             style={{boxSizing: 'border-box'}}>
                            <div className="text-with-icon">
                                <div className="icon-container">
                                    <IconComponent fill={activity.icon.color}/>
                                </div>
                                <h2 className="card-event-name">{activity.name}</h2>
                            </div>
                        </div>
                    )
                })}
            </div>
            <Modal isOpen={isEditDialogOpen} onRequestClose={closeEditDialog} style={{
                content: {
                    width: '35%', height: '75%', margin: 'auto',
                }
            }}>
                <AddActivityForm activity={selectedActivities} onClose={closeEditDialog} onDelete={fetchActivity} />
            </Modal>
            <Modal isOpen={isAddDialogOpen} onRequestClose={closeAddDialog} style={{
                content: {
                    width: '35%', height: '75%', margin: 'auto',
                }
            }}>
                <AddActivityForm onClose={closeAddDialog}/>
            </Modal>
        </div>
    )
};

export default ActivityList;
