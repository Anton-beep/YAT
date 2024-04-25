import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import {ReactComponent as Star} from '../icons/star.svg';
import {ReactComponent as Clock} from '../icons/clock.svg';
import {ReactComponent as X} from '../icons/x-lg.svg';

import {ReactComponent as Alt} from "../icons/alt.svg";
import {ReactComponent as Archive} from "../icons/archive.svg";
import {ReactComponent as Bag} from "../icons/bag.svg";
import {ReactComponent as Basket} from "../icons/basket.svg";
import {ReactComponent as Book} from "../icons/book.svg";
import {ReactComponent as Briefcase} from "../icons/briefcase.svg";
import {ReactComponent as BrokenLine} from "../icons/brokenLine.svg";
import {ReactComponent as Brush} from "../icons/brush.svg";
import {ReactComponent as Calendar_Event} from "../icons/calendarEvent.svg";
import {ReactComponent as Geo} from "../icons/geo.svg";
import {ReactComponent as House} from "../icons/house.svg";
import {ReactComponent as Journal} from "../icons/journal.svg";

import EventForm from "./EventForm";
import 'bootstrap/dist/css/bootstrap.min.css';

import Auth from '../pkg/auth';
import '../App.css';
import ClockIcon from "./ClockIcon/ClockIcon";
import TagsFilter from "./TagsFilter/TagsFilter";

const iconComponents = {
    "alt": Alt,
    "archive": Archive,
    "bag": Bag,
    "basket": Basket,
    "book": Book,
    "briefcase": Briefcase,
    "brokenLine": BrokenLine,
    "brush": Brush,
    "calendarEvent": Calendar_Event,
    "geo": Geo,
    "house": House,
    "journal": Journal,
};


const EventsList = ({created, finished, onMain, rerender}) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const [events, setEvents] = useState([]);
    const [activities, setActivities] = useState({});
    const [tags, setTags] = useState([]);
    const [factors, setFactors] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [elapsedTimes, setElapsedTimes] = useState(0);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const handleTagCheckChange = (tagId) => {
        setTags(tags.map(tag => tag.id === tagId ? {...tag, checked: !tag.checked} : tag));
        setSelectedTags(tags.filter(tag => tag.checked).map(tag => tag.id));
    };

    const [isCardOpen, setIsCardOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const formatTime = (utcTimestamp) => {
        const date = new Date(utcTimestamp * 1000);
        return date.toLocaleTimeString();
    };

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/activities/')
            .then(response => {
                const new_activities = response.data.activities.reduce((acc, activity) => ({
                    ...acc,
                    [activity.id]: {
                        "name": activity.name,
                        "icon": {"name": activity.icon.name, "color": activity.icon.color},
                        "visible": activity.visible,
                    },
                }), {});
                setActivities(new_activities);
            })
            .catch(error => {
                console.error(error);
            })
    }, [rerender.activities]);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/events/', {
            params: {
                "created": created,
                "tags": [],
            }
        })
            .then(response => {
                setEvents(response.data.events);
            })
            .catch(error => {
                console.error(error);
            })
    }, [created, finished, isFormOpen, rerender.activities, rerender.factors, rerender.tags]);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/tags/')
            .then(response => {
                    const newTags = response.data.tags.map(tag => ({
                        ...tag,
                        id: tag.id,
                        name: tag.name,
                        visible: tag.visible,
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
        setSelectedTags(tags.filter(tag => tag.checked).map(tag => tag.id));
    }, [tags]);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/factors/')
            .then(response => {
                    setFactors(response.data.factors);
                }
            )
            .catch(error => {
                console.error(error);
            })
    }, [rerender.factors]);

    useEffect(() => {
        const intervalIds = {};

        events.forEach(event => {
            if (event.finished) {
                return;
            }

            const eventCreatedTimestamp = Math.floor(event.created);

            const intervalId = setInterval(() => {
                const differenceInSeconds = Math.floor((Date.now() / 1000)) - eventCreatedTimestamp;

                setElapsedTimes(prevTimes => {
                    // Create a new object with the same properties as prevTimes
                    const newTimes = {...prevTimes};
                    // Update the property for the current event
                    newTimes[event.id] = differenceInSeconds;
                    // Return the new object
                    return newTimes;
                });
            }, 1000);

            intervalIds[event.id] = intervalId;
        });

        return () => {
            Object.values(intervalIds).forEach(clearInterval);
        };
    }, [events, isFormOpen]);

    const formatElapsedTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const visibleActivities = Object.keys(activities)
        .filter(key => activities[key].visible)
        .reduce((obj, key) => {
            obj[key] = activities[key];
            return obj;
        }, {});

    return (
        <div style={{border: '1px solid lightgrey', borderRadius: '10px', marginLeft: '10px'}}>
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
                <TagsFilter tags={tags} onTagSelection={setSelectedTags} closeModal={() => setIsFilterOpen(false)} oldSelectedTags={selectedTags}/>
            </Modal>

            <Modal
                isOpen={isFormOpen}
                onRequestClose={() => {
                    setIsFormOpen(false);
                    setSelectedEvent(null);
                }}
                style={{
                    content: {
                        width: '40%',
                        height: '80%',
                        margin: 'auto',
                    }
                }}
            >
                {Object.keys(activities).length > 0 ? (
                    <EventForm
                        tags={tags}
                        factors={factors}
                        activities={visibleActivities}
                        event={selectedEvent}
                        closeModal={() => setIsFormOpen(false)}
                    />
                ) : (
                    <div className="alert alert-danger">
                        Доступных активностей нет. Сначала добавьте активность, чтобы создать событие.
                    </div>
                )}
            </Modal>

            <div className="header">
                <h2 style={{marginTop: '10px'}}>События</h2>
            </div>
            <div className="buttons">
                {onMain &&
                    <button className="button-green button-gap" onClick={() => setIsFormOpen(true)}>Добавить событие
                    </button>}
                <button className="button-orange button-gap" onClick={() => setIsFilterOpen(true)}>Фильтр по тегам
                </button>
                {Boolean(selectedTags.length !== 0) && <button className="button-orange button-gap" onClick={() => {
                    setSelectedTags([]);
                    setTags(tags.map(tag => ({...tag, checked: false})));
                }}>
                    {tags.filter(tag => tag.checked).map(tag => tag.name).join(', ')}
                    <X fill="red"/>
                </button>}
            </div>

            <div className="event-container">

                {events
                    .filter(event => selectedTags.length === 0 || selectedTags
                        .every(tagId => event.tags.includes(tagId)))
                    .map((event, index) => {
                        const IconComponent = activities[event.activity_id] && iconComponents[activities[event.activity_id].icon.name];
                        let factorMean;
                        if (event.factors.length === 0) {
                            factorMean = "Нет оценок";
                        } else {
                            factorMean = Math.round((event.factors.reduce((sum, factor) => sum + factor.value, 0) / event.factors.length) * 100) / 100;
                        }
                        const factorColor = factorMean > 5 ? 'green' : factorMean < -5 ? 'red' : 'black';
                        return (
                            <div key={event.id} className="event-card" onClick={() => {
                                setSelectedEvent(event);
                                setIsFormOpen(true);
                            }}>
                                <div className="text-with-icon">
                                    <IconComponent className="icon-fixed-size"
                                                   fill={activities[event.activity_id].icon.color}/>
                                    <h4>{activities[event.activity_id].name}</h4>
                                </div>

                                {Boolean(event.finished) && <div>
                                    <div className="text-with-icon">
                                        <Clock className="icon-fixed-size"/>
                                        <span
                                            className="span-ellipsis">{formatTime(event.created)} - {formatTime(event.finished)}</span>
                                    </div>

                                    <div className="text-with-icon factor-right">
                                        <Star fill={factorColor} className="icon-fixed-size"/>
                                        <span style={{color: factorColor}}>{factorMean}</span>
                                    </div>
                                </div>}
                                {!Boolean(event.finished) && <div>
                                    <div className="text-with-icon">
                                        <ClockIcon initialSeconds={elapsedTimes[event.id]}
                                                   key={elapsedTimes[event.id] || 0}/>
                                        <span>{!Boolean(event.finished) ? formatElapsedTime(elapsedTimes[event.id] || 0) : formatTime(event.created)}</span>
                                    </div>
                                </div>}
                            </div>
                        )
                    })}
            </div>
        </div>
    )
};

export default EventsList;
