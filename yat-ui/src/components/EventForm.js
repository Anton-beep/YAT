import React, {useState} from 'react';


const FactorsComponent = ({ factors }) => {
  const [factorValues, setFactorValues] = useState(factors.map(factor => factor.value));

  const handleFactorChange = (index, newValue) => {
    const newFactorValues = [...factorValues];
    newFactorValues[index] = newValue;
    setFactorValues(newFactorValues);
  };

  return (
    <div className="mb-3">
      {factors.map((factor, index) => (
        <div key={index} className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">{factor.name} {factorValues[index]}</span>
          <input
            type="range"
            className="form-control"
            value={factorValues[index]}
            min="-10"
            max="10"
            step="1"
            onChange={(e) => handleFactorChange(index, parseInt(e.target.value))}
          />
        </div>
      ))}
    </div>
  );
};



function EventForm({tags = [], icons = {}, initialFactors = {}, activities = {}}) {
    const activitiesArray = Object.keys(activities).map((id) => ({id, name: activities[id]}));
    const factors = Object.keys(initialFactors).map((id) => ({id, name: activities[id], value: 0}));

    const [selectedActivity, setSelectedActivity] = useState(activitiesArray[0].name);
    const updateSelection = (activityName) => {
        setSelectedActivity(activityName);

    };

    return (<div>
        <form>
            <h4>Добавить новое событие</h4>
            <div className="mb-3">
                <label htmlFor='activity'>Активность</label>
                <select id="activity" className="form-select" aria-label="Default select example">
                    {activitiesArray.map((activity) => (<option value={activity.id}>{activity.name}</option>))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="textarea" className="form-label">Описание</label>
                <textarea className="form-control" id="textarea" rows="2"></textarea>
            </div>

            <div className="mb-3">
                {tags.map(tag => (<div key={tag.id}>
                        <input value={tag.id} className="form-check-input" type="checkbox"/>
                        <label className="form-check-label">{tag.name}</label>
                    </div>))}</div>

            <FactorsComponent factors={factors} />

          <button type="submit" className="btn btn-primary">Добавить</button>
        </form>
        </div>
    );
}

export default EventForm;













