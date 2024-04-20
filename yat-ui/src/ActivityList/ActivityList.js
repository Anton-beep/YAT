import React, {useEffect, useState} from 'react';
import {ReactComponent as Bib} from '../icons/bib.svg';
import {ReactComponent as Bob} from '../icons/bob.svg';

import Auth from '../pkg/auth';
import '../App.css';

const iconComponents = {
    "bib.svg": Bib,
    "bob.svg": Bob,
};


const ActivityList = () => {
    const [activities, setActivities] = useState([] );


    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/activities')
            .then(response => {
                console.log(123);
                setActivities(response.data.activities);
            })
            .catch(error => {
                console.error(error);
            })
    }, []);

    return (
        <div>
            <div className="header">
                <h1>Активности</h1>
            </div>
            <div className="event-container">

                {activities
                    .map((activity, index) => {
                        const IconComponent = iconComponents[activity.icon.name];
                        return (
                            <div key={activity.id} className="event-card">
                                <div className="text-with-icon">
                                    <IconComponent fill={activity.icon.color}/>
                                    <h2>{activity.name}</h2>
                                </div>
                            </div>
                        )
                    })}
            </div>

        </div>
    )
};

export default ActivityList;
