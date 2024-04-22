import React, {useEffect, useState} from 'react';
import Auth from '../pkg/auth';


function EventForm({tags = [], icons = {}, visibleFactors = {}, activities = {}, event = null}) {
    const [selectedActivity, setSelectedActivity] = useState(event ? activities[event.activity_id].name : '');
    const [description, setDescription] = useState(event ? event.description : '');
    const [selectedTags, setSelectedTags] = useState(event ? event.tags : []);
    const [icon, setIcon] = useState({name: 'bib.svg', color: '#2a82a8'});
    const [created, setCreated] = useState(event ? event.created : '');
    const [finished, setFinished] = useState(event ? event.finished : '');
    const [elapsedTime, setElapsedTime] = useState(0);

    const activitiesArray = Object.keys(activities).map((id) => ({id, name: activities[id].name}));
    const [activityId, setActivityId] = useState(activitiesArray[0].id);
    const [factorValues, setFactorValues] = useState([]);

    const handleCreatedChange = (event) => {
        const datetime = new Date(event.target.value);
        const timestamp = Math.floor(datetime.getTime() / 1000); // convert to seconds
        setCreated(timestamp.toString());
    };

    const handleFinishedChange = (event) => {
        const datetime = new Date(event.target.value);
        const timestamp = Math.floor(datetime.getTime() / 1000); // convert to seconds
        setFinished(timestamp.toString());
    };

    const formatElapsedTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (Object.keys(activities).length === 0) {
        return (
            <h2>
                Добавте сначала хотя бы одну активность
            </h2>
        );
    }

    const updateSelection = (activityName) => {
        setSelectedActivity(activityName);

    };

    const handleFinishEvent = () => {
        if (event) {
            Auth.axiosInstance.put(`/api/v1/homepage/events/`, {
                id: event.id,
                finished: Math.floor(Date.now() / 1000),
                description: event.description,
                tags: event.tags,
                factors: event.factors,
                activity_id: event.activity_id,
            })
                .then(response => {
                    window.location.reload();
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }

    const handleSubmit = (eventForm) => {
        eventForm.preventDefault();

        const factorsToSend = visibleFactors.map((factor, index) => ({
            id: factor.id, value: factorValues[index]
        }));

        const data = {
            description,
            tags: selectedTags,
            created: Math.floor(Date.now() / 1000),
            finished,
            factors: finished !== '' ? factorsToSend : [],
            activity_id: activityId
        };

        const request = event ?
            Auth.axiosInstance.put(`/api/v1/homepage/events/`, {...data, id: event.id}) :
            Auth.axiosInstance.post('/api/v1/homepage/events/', data);

        request
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleDelete = () => {
        // Make a DELETE request to delete the event
        Auth.axiosInstance.delete(`/api/v1/homepage/events/`, {data: {id: event.id}})
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleFinishedonChange = (event) => {
        const date = new Date(event.target.value);
        const timestamp = Math.floor(date.getTime() / 1000); // convert to seconds
        setFinished(timestamp.toString());
    };
    const handleCreatedOnChange = (event) => {
        const date = new Date(event.target.value);
        const timestamp = Math.floor(date.getTime() / 1000); // convert to seconds
        setCreated(timestamp.toString());
    };

    const handleDescriptionOnChange = (event) => {
        setDescription(event.target.value);
    }

    const handleActivityChange = (event) => {
        setActivityId(event.target.value);
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
            <h4>Добавить новое событие</h4>
            <div className="mb-3">
                <label htmlFor='activity'>Активность</label>
                <select id="activity" className="form-select" aria-label="Default select example"
                        onChange={handleActivityChange} value={activityId}>
                    {activitiesArray.map((activity) => (
                        <option key={activity.id} value={activity.id}>{activity.name}</option>))}
                </select>
            </div>

            {Boolean(finished) && <div className="mb-3">
                <label htmlFor="created" className="form-label">Начало:</label>
                <input type="datetime-local" id="created" className="form-control" onChange={handleCreatedChange}
                       value={new Date(created * 1000).toISOString().slice(0, 16)}/>
            </div>}

            <div className="mb-3">
                <label htmlFor="finished" className="form-label">Конец:</label>
                <input type="datetime-local" id="finished" className="form-control" onChange={handleFinishedChange}
                       value={new Date(finished * 1000).toISOString().slice(0, 16)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="textarea" className="form-label">Описание</label>
                <textarea className="form-control" id="textarea" rows="2"
                          onChange={handleDescriptionOnChange} value={description}></textarea>
            </div>

            <div className="mb-3">
                {tags.map(tag => (<div key={tag.id}>
                    <input value={tag.id} className="form-check-input" type="checkbox"
                           onChange={handleTagChange} checked={selectedTags.includes(tag.id)}/>
                    <label className="form-check-label">{tag.name}</label>
                </div>))}
            </div>

            {Boolean(finished) && <FactorsComponent availableFactors={visibleFactors} eventFactors={event.factors}/>}

            <button type="submit" className="button-green button-gap">Сохранить</button>
            {event && <button type="button" className="button-red button-gap" onClick={handleDelete}>Удалить</button>}
            {event && !event.finished && (
                <button type="button" className="button-orange" onClick={handleFinishEvent}>Закончить</button>
            )}
        </form>
    </div>);
}

const FactorsComponent = ({availableFactors, eventFactors}) => {
    const [factors, setFactorValues] = useState(availableFactors);

    useEffect(() => {
        console.log("availableFactors", availableFactors);
        if (eventFactors) {
            Auth.axiosInstance.get('/api/v1/homepage/factors/')
                .then(response => {
                    for (let usedFactor of eventFactors) {
                        const factor = response.data.factors.find(factor => factor.id === usedFactor.id);
                        if (factor) {
                            setFactorValues([...factors, {"name": factor.name, "value": usedFactor.value}]);
                        }
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, []);


    const handleFactorChange = (index, newValue) => {
        // const newFactorValues = [...factorValues];
        // newFactorValues[index] = newValue;
        // setFactorValues(newFactorValues);
    };

    console.log(factors[0])

    return (<div className="mb-3">
        {factors.map((index, factor) => (<div key={index} className="input-group mb-3">
                    <span className="input-group-text"
                          id="inputGroup-sizing-default">{factor.name}</span>
            <input
                type="range"
                className="form-control"
                value={factor.value || 5}
                min="0"
                max="10"
                step="1"
                onChange={(e) => handleFactorChange(index, parseInt(e.target.value))}
            />
        </div>))}
    </div>);
};

export default EventForm;











