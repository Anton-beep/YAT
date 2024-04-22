import React, {useState} from 'react';
import Auth from '../pkg/auth';


function EventForm({tags = [], icons = {}, initialFactors = {}, activities = {}}) {
    const [selectedActivity, setSelectedActivity] = useState("");
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [icon, setIcon] = useState({name: 'bib.svg', color: '#2a82a8'});
    const [created, setCreated] = useState(Date.now().toString().slice(0, -3));
    const [finished, setFinished] = useState('');
    const [factors, setFactors] = useState([{id: 1, value: 10}]);

    const activitiesArray = Object.keys(activities).map((id) => ({id, name: activities[id].name}));
    const [activityId, setActivityId] = useState(activitiesArray[0].id);
    const [factorValues, setFactorValues] = useState([]);

    if (Object.keys(activities).length===0) {
        return (
            <h2>
                Добавте сначала хотя бы одну активность
            </h2>
        );
    }

    const factorsArray = Object.keys(initialFactors).map((id) => ({id, name: initialFactors[id], value: 5}));

    const updateSelection = (activityName) => {
        setSelectedActivity(activityName);

    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const factorsToSend = factorsArray.map((factor, index) => ({
            id: factor.id, value: factorValues[index]
        }));

        const data = {
            description,
            tags: selectedTags,
            created,
            finished,
            factors: finished !== '' ? factorsToSend : [],
            activity_id: activityId
        };

        Auth.axiosInstance.post('/api/v1/homepage/events/', data)
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
                        onChange={handleActivityChange}>
                    {activitiesArray.map((activity) => (<option key={activity.id} value={activity.id}>{activity.name}</option>))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="date" className="form-label">Конец</label>
                <input type="date" id="date" className="form-control" onChange={handleFinishedonChange}/>
            </div>

            {Boolean(finished) && <div className="mb-3">
                <label htmlFor="date" className="form-label">Начало</label>
                <input type="date" id="date" className="form-control" onChange={handleCreatedOnChange}/>
            </div>}

            <div className="mb-3">
                <label htmlFor="textarea" className="form-label">Описание</label>
                <textarea className="form-control" id="textarea" rows="2"
                          onChange={handleDescriptionOnChange}></textarea>
            </div>

            <div className="mb-3">
                {tags.map(tag => (<div key={tag.id}>
                    <input value={tag.id} className="form-check-input" type="checkbox" onChange={handleTagChange}/>
                    <label className="form-check-label">{tag.name}</label>
                </div>))}
            </div>

            {Boolean(finished) && <FactorsComponent factors={factorsArray} factorValues={factorValues}
                                                    setFactorValues={setFactorValues}/>}

            <button type="submit" className="btn btn-primary">Добавить</button>
        </form>
    </div>);
}

const FactorsComponent = ({factors, factorValues, setFactorValues}) => {
    const handleFactorChange = (index, newValue) => {
        const newFactorValues = [...factorValues];
        newFactorValues[index] = newValue;
        setFactorValues(newFactorValues);
    };

    return (<div className="mb-3">
            {factors.map((factor, index) => (<div key={index} className="input-group mb-3">
                    <span className="input-group-text"
                          id="inputGroup-sizing-default">{factor.name} {factorValues[index]}</span>
                    <input
                        type="range"
                        className="form-control"
                        value={factorValues[index]}
                        min="0"
                        max="10"
                        step="1"
                        onChange={(e) => handleFactorChange(index, parseInt(e.target.value))}
                    />
                </div>))}
        </div>);
};


export default EventForm;













