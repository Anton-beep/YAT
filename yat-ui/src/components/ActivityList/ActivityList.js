import React, {useEffect, useState} from 'react';
import {ReactComponent as Bib} from '../../icons/bib.svg';
import {ReactComponent as Bob} from '../../icons/bob.svg';
import AddActivityForm from '../AddActivityForm/AddActivityForm';
import Modal from 'react-modal';

import Auth from '../../pkg/auth';
import '../../App.css';

const iconComponents = {
    "bib.svg": Bib,
    "bob.svg": Bob,
};


const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/activities/')
            .then(response => {
                const visibleActivities = response.data.activities.filter(activity => activity.visible);
                console.log(response.data.activities)
                setActivities(visibleActivities);
            })
            .catch(error => {
                console.error(error);
            })
    }, []);

    const openEditDialog = (activity) => {
        setSelectedActivity(activity);
        setIsEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setSelectedActivity(null);
        setIsEditDialogOpen(false);
    };

    return (
        <div style={{border: '1px solid lightgrey', borderRadius: '10px'}}>
            <div className="header">
                <h1 className="list-title">Активности</h1>
            </div>
            <div className="event-container" style={{height: '300px', overflowY: 'auto', boxSizing: 'border-box'}}>
                {activities.map((activity, index) => {
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
                <AddActivityForm activity={selectedActivity} closeDialog={closeEditDialog}/>
            </Modal>
        </div>
    )
};

export default ActivityList;
