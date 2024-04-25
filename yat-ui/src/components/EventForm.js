import React, {useEffect, useState} from 'react';
import Auth from '../pkg/auth';


function EventForm({tags = [], icons = {}, factors = [], activities = {}, event = null, closeModal}) {
    const [selectedActivity, setSelectedActivity] = useState(event ? activities[event.activity_id].name : '');
    const [description, setDescription] = useState(event ? event.description : '');
    const [selectedTags, setSelectedTags] = useState(event ? event.tags : []);
    const [icon, setIcon] = useState({name: 'bib.svg', color: '#2a82a8'});
    const [created, setCreated] = useState(event ? convertUTCToLocalTime(event.created) : '');
    const [finished, setFinished] = useState(event ? convertUTCToLocalTime(event.finished) : '');
    const [elapsedTime, setElapsedTime] = useState(0);

    const activitiesArray = Object.keys(activities).map((id) => ({id, name: activities[id].name}));
    const [activityId, setActivityId] = useState(event ? event.activity_id : activitiesArray[0].id);
    const [factorsFromChild, setFactorsFromChild] = useState([]);
    const [factorsToSendFromChild, setFactorsToSendFromChild] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const updateFactorsToSendFromChild = (factors) => {
        setFactorsToSendFromChild(factors);
    };

    const updateFactorsFromChild = (factors) => {
        setFactorsFromChild(factors);
    };

    const handleCreatedChange = (event) => {
        setCreated(event.target.value);
    };

    const handleFinishedChange = (event) => {
        setFinished(event.target.value);
    };

    if (Object.keys(activities).length === 0) {
        return (
            <h2>
                Добавте сначала хотя бы одну активность
            </h2>
        );
    }

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
                    closeModal();
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }

    const handleSubmit = (eventForm) => {
        eventForm.preventDefault();

        if (finished !== '' && created !== '' && parseInt(finished) < parseInt(created)) {
            setErrorMessage('Дата начала не может быть позже даты окончания');
            return;
        }

        const factorsToSend = factorsFromChild
            .filter((factor, index) => factorsToSendFromChild[index])
            .map(factor => ({id: factor.id, value: factor.value}));

        const data = {
            description,
            tags: selectedTags,
            factors: finished !== '' ? factorsToSend : [],
            activity_id: activityId
        };

        if (finished !== null) {
            data.finished = Date.parse(finished.toString()) / 1000;
        }
        if (created !== null) {
            data.created = Date.parse(created.toString()) / 1000;
        }

        const request = event ?
            Auth.axiosInstance.put(`/api/v1/homepage/events/`, {...data, id: event.id}) :
            Auth.axiosInstance.post('/api/v1/homepage/events/', data);

        request
            .then(response => {
                closeModal();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleDelete = () => {
        // Make a DELETE request to delete the event
        Auth.axiosInstance.delete(`/api/v1/homepage/events/`, {data: {id: event.id}})
            .then(response => {
                closeModal();
            })
            .catch(error => {
                console.log(error);
            });
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

    function convertUTCToLocalTime(utcTimestamp) {
        // Convert the UTC timestamp from seconds to milliseconds
        const date = new Date(utcTimestamp * 1000);
        // Format the date to a string in the 'YYYY-MM-DDTHH:mm' format
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const localTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        return localTime;
    }

    return (<div>
        <form onSubmit={handleSubmit}>
            <h4>Добавить новое событие</h4>
            <div className="mb-3">
                <label htmlFor='activity'>Активность</label>
                <select id="activity" className="form-select" aria-label="Default select example"
                        onChange={handleActivityChange} value={activityId}>
                    {activitiesArray.map((activity) => (
                        <option key={activity.id} value={activity.id}>{activity.name}</option>
                    ))}
                </select>
            </div>

            {Boolean(finished) && <div className="mb-3">
                <label htmlFor="created" className="form-label">Начало:</label>
                <input type="datetime-local" id="created" className="form-control" onChange={handleCreatedChange}
                       value={created}/>
            </div>}

            <div className="mb-3">
                <label htmlFor="finished" className="form-label">Конец:</label>
                <input type="datetime-local" id="finished" className="form-control" onChange={handleFinishedChange}
                       value={finished}/>
            </div>

            <div className="mb-3">
                <label htmlFor="textarea" className="form-label">Описание:</label>
                <textarea className="form-control" id="textarea" rows="2"
                          onChange={handleDescriptionOnChange} value={description}></textarea>
            </div>

            <div className="mb-3">
                <label htmlFor="tags" className="form-label">Теги:</label>
                {tags.filter(tag => tag.visible).map(tag => (<div key={tag.id}>
                    <input value={tag.id} className="form-check-input" type="checkbox"
                           onChange={handleTagChange} checked={selectedTags.includes(tag.id)}/>
                    <label className="form-check-label">{tag.name}</label>
                </div>))}
            </div>

            {Boolean(finished) && <FactorsComponent factors={factors} eventFactors={event ? event.factors : []}
                                                    updateFactorsFromChild={updateFactorsFromChild}
                                                    updateFactorsToSendFromChild={updateFactorsToSendFromChild}/>}

            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
            <button type="submit" className="button-green button-gap">Сохранить</button>
            {event && <button type="button" className="button-red button-gap" onClick={handleDelete}>Удалить</button>}
            {event && !event.finished && (
                <button type="button" className="button-orange button-gap" onClick={handleFinishEvent}>Закончить</button>
            )}
            <button type="button" className="button-orange" onClick={closeModal}>Назад</button>
        </form>
    </div>);
}

const FactorsComponent = ({factors, eventFactors, updateFactorsFromChild, updateFactorsToSendFromChild}) => {
    eventFactors = eventFactors
        .map(eventFactor => ({...eventFactor, name: factors.find(factor => factor.id === eventFactor.id).name}));
    const visibleFactors = factors
        .filter(factor => factor.visible)
        .map(factor => ({
            ...factor,
            value: eventFactors.find(eventFactor => eventFactor.id === factor.id)?.value || 5
        }));
    const [factorsShow, setFactorShow] = useState([...visibleFactors, ...eventFactors.filter(eventFactor => !visibleFactors.find(factor => factor.id === eventFactor.id))]);
    const [factorsToSend, setFactorsToSend] = useState(factorsShow.map(factor => eventFactors.some(eventFactor => eventFactor.id === factor.id)));

    useEffect(() => {
        updateFactorsToSendFromChild(factorsToSend);
    }, [factorsToSend]);

    useEffect(() => {
        updateFactorsFromChild(factorsShow);
    }, [factorsShow]);

    const handleFactorChange = (index, newValue) => {
        const newFactors = [...factorsShow];
        newFactors[index].value = newValue;
        setFactorShow(newFactors);
    };

    const handleCheckboxChange = (index, isChecked) => {
        const newFactorsToSend = [...factorsToSend];
        newFactorsToSend[index] = isChecked;
        setFactorsToSend(newFactorsToSend);
    };

    return (<div className="mb-3" style={{overflowY: "auto"}}>
        <label htmlFor="factors" className="form-label">Факторы:</label>
        {factorsShow.map((factor, index) => (<div key={index} className="input-group mb-3">
                    <span className="input-group-text"
                          id="inputGroup-sizing-default">{factor.name}</span>
            <input
                style={{marginRight: '10px'}}
                type="range"
                className="form-control"
                value={factor.value !== undefined && factor.value !== null ? factor.value : 5}
                min="0"
                max="10"
                step="1"
                onChange={(e) => handleFactorChange(index, parseInt(e.target.value))}
                disabled={!factorsToSend[index]}
            />
            <span
                style={{marginRight: '10px'}}>{factor.value !== undefined && factor.value !== null ? factor.value : 5}</span>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name={`sendFactor${index}`}
                    id={`sendFactor${index}`}
                    checked={factorsToSend[index]}
                    onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                />
            </div>
        </div>))}
    </div>);
};

export default EventForm;











