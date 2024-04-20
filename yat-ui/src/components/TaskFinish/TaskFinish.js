import React, {useState} from 'react';
import Auth from '../../pkg/auth';


function TaskFinish({task = {}, initialFactors = {}}) {
    const factorsArray = Object.keys(initialFactors).map((id) => ({id, name: initialFactors[id], value: 5}));
    const [factors, setFactors] = useState([{id: 1, value: 10}]);
    const [factorValues, setFactorValues] = useState(factorsArray.map(() => 0));

    const handleSubmit = (event) => {
        event.preventDefault();

        const factorsToSend = factorsArray.map((factor, index) => ({
            id: factor.id, value: factorValues[index]
        }));

        const data = {
            id: task.id,
            name: task.name,
            description: task.description,
            tags: task.tags,
            status: "done",
            deadline: task.deadline,
            factors: factorsToSend,
        };

        Auth.axiosInstance.put('/api/v1/homepage/tasks/', data)
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    };


    return (<div>
        <form onSubmit={handleSubmit}>
            <h4>Завершить задачу</h4>

            <FactorsComponent factors={factorsArray} factorValues={factorValues}
                                                    setFactorValues={setFactorValues}/>

            <button type="submit"   className="btn btn-primary">Завершить</button>
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


export default TaskFinish;













