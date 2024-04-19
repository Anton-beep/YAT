import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import {ReactComponent as Square} from "../../icons/square.svg";
import {ReactComponent as SquareCheck} from "../../icons/check-square.svg";
import {ReactComponent as SquareX} from "../../icons/x-square.svg";
import {ReactComponent as X} from "../../icons/x-lg.svg";
import {ReactComponent as Clock} from "../../icons/clock.svg";
import {ReactComponent as Star} from "../../icons/star.svg";

import Auth from '../../pkg/auth';
import '../../App.css';
import TaskForm from "../TaskForm/TaskForm";
import TaskFinish from "../TaskFinish/TaskFinish";

const iconComponents = {
    "done": SquareCheck,
    "not done": Square,
    "failed": SquareX,
};

const TaskList = ({created, finished, done, onMain}) => {
    const [tasks, setTasks] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isFinished, setFinished] = useState(false);
    const [factors, setFactors] = useState({});

    const handleTagCheckChange = (tagId) => {
        setTags(tags.map(tag => tag.id === tagId ? {...tag, checked: !tag.checked} : tag));
        setSelectedTags(tags.filter(tag => tag.checked).map(tag => tag.id));
        console.log(selectedTags[0]);
    };

    const [isCardOpen, setIsCardOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [isFormOpen, setIsFormOpen] = useState(false);

    const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because getMonth() returns month index starting from 0
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/homepage/tasks', {params: {
                "created": created,
                "finished": finished,
                "tags": [],
                "status": done,
            }
        })
            .then(response => {
                setTasks(response.data.tasks);
            })
            .catch(error => {
                console.error(error);
            })
    }, [created, finished, done]);

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
                        width: '35%',
                        height: '50%',
                        margin: 'auto',
                    }
                }}
            >
                Фильтрация по тегам
                {tags.map(tag => (
                    <div key={tag.id}>
                        <input className="form-check-input" type="checkbox" checked={tag.checked} onChange={() => handleTagCheckChange(tag.id)}/>
                        <label className="form-check-label">{tag.name}</label>
                    </div>
                ))}
            </Modal>

            <Modal
                isOpen={isCardOpen}
                onRequestClose={() => setIsCardOpen(false)}
                style={{
                    content: {
                        width: '35%',
                        height: '70%',
                        margin: 'auto',
                    }
                }}
            >
                {selectedTask && (
                    <>
                        <h2>{selectedTask.name}</h2>
                        <p>Дедлайн: {formatTime(selectedTask.deadline)}</p>
                        <p>Статус: {selectedTask.status}</p>
                        <p>{selectedTask.description}</p>
                        {Boolean(selectedTask.finished) && <div>
                            <p>Вермя начала: {formatTime(selectedTask.created)}</p>
                            <p>Время конца: {formatTime(selectedTask.finished)}</p>
                        </div>}
                        <p>Теги: {selectedTask.tags.map(tagId => tags.find(tag => tag.id === tagId).name).join(', ')}</p>
                        {selectedTask.factors.map((factor, index) => (
                            <div key={index}>
                                <label>{factors[factor.id]}: </label>

                                <div className="progress" role="progressbar" aria-label="Basic example">
                                    <div className="progress-bar" style={{width: `${(factor.value * 5 + 50)}%`}}>{factor.value}</div>
                                </div>
                            </div>
                        ))}
                        <p>Создано {formatTime(selectedTask.created)}</p>
                        {!Boolean(selectedTask.finished) && <div>
                            <button type="button" className="btn btn-primary" onClick={() => {setIsCardOpen(false); setFinished(true)}}>Завершить задачу</button>
                        </div>}
                    </>
                )}


            </Modal>

            <Modal
                isOpen={isFormOpen}
                onRequestClose={() => setIsFormOpen(false)}
                style={{
                    content: {
                        width: '40%',
                        height: '80%',
                        margin: 'auto',
                    }
                }}
            >
                <TaskForm tags={tags} />
            </Modal>

            <Modal
                isOpen={isFinished}
                onRequestClose={() => setFinished(false)}
                style={{
                    content: {
                        width: '40%',
                        height: '80%',
                        margin: 'auto',
                    }
                }}
                >
                <TaskFinish task={selectedTask} initialFactors={factors} />
            </Modal>

            <div className="header">
                <h1>Текущие задачи</h1>
            </div>
            <div className="buttons">
                {onMain && <button className="button-green button-gap" onClick={() => setIsFormOpen(true)}>Добавить новую задачу
                </button>}
                <button className="button-orange button-gap" onClick={() => setIsFilterOpen(true)}>Фильтр по тегам
                </button>
            </div>

            <div className="buttons" style={{marginTop: "10px"}}>
                {Boolean(selectedTags.length !== 0) && <button className="button-orange button-gap" onClick={() => {
                    setSelectedTags([]);
                    setTags(tags.map(tag => ({...tag, checked: false})));
                }}>
                    {tags.filter(tag => tag.checked).map(tag => tag.name).join(', ')}
                    {"  "} <X fill="red"/>
                </button>}

            </div>

            <div className="event-container">
                {tasks
                    .filter(task => selectedTags.length === 0 || selectedTags
                        .every(tagId => task.tags.includes(tagId)))
                    .map((task, index) => {
                        const currentDate = new Date();
const deadlineDate = new Date(task.deadline * 1000); // Convert to milliseconds as JavaScript Date object takes time in milliseconds

let IconComponent;
if (deadlineDate < currentDate) {
    IconComponent = iconComponents["failed"];
} else {
    IconComponent = iconComponents[task.status] || Star;
}
                        const factorMean = task.factors.reduce((sum, factor) => sum + factor.value, 0) / task.factors.length;
                        const factorColor = factorMean > 5 ? 'green' : factorMean < -5 ? 'red' : 'black';

                        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

                        const diffTime = Math.abs(deadlineDate - currentDate);
                        const diffDays = Math.ceil(diffTime / oneDay);

                        const deadlineColor = diffDays <= 1 ? 'red' : 'black';
                        return (
                            <div key={task.id} className="event-card" onClick={() => {
                                setSelectedTask(task);
                                setIsCardOpen(true);
                            }}>
                                <div className="text-with-icon">
                                    <IconComponent />
                                    <h2>{task.name}</h2>
                                </div>

                                {Boolean(task.finished) && <div>
                                    <div className="text-with-icon">
                                        <Clock />
                                        <span>{formatTime(task.deadline)}</span>
                                    </div>

                                    <div className="text-with-icon factor-right">
                                        <Star fill={factorColor}/>
                                        <span style={{color: factorColor}}>{factorMean}</span>
                                    </div>
                                </div>}

                                {!Boolean(task.finished) && <div>
                                    <div className="text-with-icon">
                                        <Clock fill={deadlineColor}/>
                                        <span style={{color: deadlineColor}}>{formatTime(task.deadline)}</span>
                                    </div>
                                </div>}
                            </div>
                        )
                    })}
            </div>
        </div>
    )
};

export default TaskList;