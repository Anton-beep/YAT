import React, {useState, useEffect} from 'react';
import Modal from 'react-modal';
import {ReactComponent as Bib} from '../icons/bib.svg';
import {ReactComponent as Bob} from '../icons/bob.svg';
import {ReactComponent as Star} from '../icons/star.svg';
import {ReactComponent as Clock} from '../icons/clock.svg';
import {ReactComponent as X} from '../icons/x-lg.svg';
import EventForm from "./EventForm";

import Auth from '../pkg/auth';
import '../App.css';

const iconComponents = {
    "bib.svg": Bib,
    "bob.svg": Bob,
};


const EventsList = ({created, finished}) => {
    const [events, setEvents] = useState([]);
    const [activities, setActivities] = useState({});
    const [tags, setTags] = useState([]);
    const [factors, setFactors] = useState({});
    const [selectedTags, setSelectedTags] = useState([]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleTagCheckChange = (tagId) => {
        setTags(tags.map(tag => tag.id === tagId ? {...tag, checked: !tag.checked} : tag));
        setSelectedTags(tags.filter(tag => tag.checked).map(tag => tag.id));
        console.log(selectedTags[0]);
    };

    const [isCardOpen, setIsCardOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [isFormOpen, setIsFormOpen] = useState(false);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/events', {
            "created": created,
            "finished": finished,
            "tags": [],
        })
            .then(response => {
                setEvents(response.data.events);
            })
            .catch(error => {
                console.error(error);
            })
    }, [created, finished]);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/activities')
            .then(response => {
                const activities = response.data.activities.reduce((acc, activity) => ({
                    ...acc,
                    [activity.id]: activity.name,
                }), {});
                setActivities(activities);
            })
            .catch(error => {
                console.error(error);
            })
    }, []);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/tags')
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
    }, []);

    useEffect(() => {
        setSelectedTags(tags.filter(tag => tag.checked).map(tag => tag.id));
    }, [tags]);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/factors')
            .then(response => {
                const new_factors = response.data.factors.reduce((acc, factor) => ({
                    ...acc,
                    [factor.id]: factor.name,
                }), {});
                setFactors(new_factors);
                }
            )
            .catch(error => {
                console.error(error);
            })
    }, []);

    return (
        <div>
            <Modal
                isOpen={isFilterOpen}
                onRequestClose={() => setIsFilterOpen(false)}
                style={{
                    content: {
                        width: '15%',
                        height: '40%',
                        margin: 'auto',
                    }
                }}
            >
                Фильтрация по тегам
                {tags.map(tag => (
                    <div key={tag.id}>
                        <input type="checkbox" checked={tag.checked} onChange={() => handleTagCheckChange(tag.id)}/>
                        <label>{tag.name}</label>
                    </div>
                ))}
            </Modal>

            <Modal
                isOpen={isCardOpen}
                onRequestClose={() => setIsCardOpen(false)}
                style={{
                    content: {
                        width: '200px',
                        height: '355px',
                        margin: 'auto',
                    }
                }}
                >
                {selectedEvent && (
                    <>
                        <h2>{activities[selectedEvent.activity_id]}</h2>
                        <p>{selectedEvent.description}</p>
                        <p>Start Time: {formatTime(selectedEvent.created)}</p>
                        <p>End Time: {formatTime(selectedEvent.finished)}</p>
                        <p>Tags: {selectedEvent.tags.map(tagId => tags.find(tag => tag.id === tagId).name).join(', ')}</p>
                        {selectedEvent.factors.map((factor, index) => (
                            <div key={index}>
                                <label>{factors[factor.id]}: </label>
                                <input type="range" min="-20" max="20" step="1" value={factor.value} disabled />
                            </div>
                        ))}
                    </>
                )}
            </Modal>

            <Modal
                isOpen={isFormOpen}
                onRequestClose={() => setIsFormOpen(false)}
                style={{
                    content: {
                        width: '200px',
                        height: '355px',
                        margin: 'auto',
                    }
                }}
            >
                <EventForm tags={tags} icons={iconComponents} initialFactors={factors}/>
            </Modal>

            <button className="button-green button-gap" onClick={() => setIsFormOpen(true)}>Добавить новое событие</button>
            <button className="button-orange button-gap" onClick={() => setIsFilterOpen(true)}>Фильтр по тегам</button>

            {Boolean(selectedTags.length !== 0) && <button className="button-orange button-gap" onClick={() => {
                setSelectedTags([]);
                setTags(tags.map(tag => ({...tag, checked: false})));
            }}>
                {tags.filter(tag => tag.checked).map(tag => tag.name).join(', ')}
                {"  "} <X fill="red"/>
            </button>}

            <div className="event-container">

                {events
                    .filter(event => selectedTags.length === 0 || selectedTags
                        .every(tagId => event.tags.includes(tagId)))
                    .map((event, index) => {
                        const IconComponent = iconComponents[event.icon.name];
                        const factorMean = event.factors.reduce((sum, factor) => sum + factor.value, 0) / event.factors.length;
                        const factorColor = factorMean > 10 ? 'green' : factorMean < 0 ? 'red' : 'black';
                        return (
                            <div key={event.id} className="event-card" onClick={() => {setSelectedEvent(event); setIsCardOpen(true);}}>
                                <div className="text-with-icon">
                                    <IconComponent fill={event.icon.color}/>
                                    <h2>{activities[event.activity_id]}</h2>
                                </div>

                                <p>{event.description}</p>

                                <div className="text-with-icon">
                                    <Clock />
                                    <span>{formatTime(event.created)} - {formatTime(event.finished)}</span>
                                </div>

                                <div className="text-with-icon factor-right">
                                    <Star fill={factorColor} />
                                    <span style={{color: factorColor}}>{factorMean}</span>
                                </div>
                            </div>
                        )
                    })}
            </div>

        </div>
    )
};

export default EventsList;