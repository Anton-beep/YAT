import React, {useEffect, useState} from 'react';
import './Dashboard.css';
import Layout from "./../Layout";
import EventsList from "../EventList";
import TaskList from "../TaskList/TaskList";
import {ReactComponent as List} from "../../icons/list.svg";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import ActivityList from "../ActivityList/ActivityList";
import Auth from "../../pkg/auth";
import TagsList from "../TagsList/TagsList";
import FactorsList from "../FactorsList/FactorsList";
import NoteList from "../NoteList/NoteList";

const Dashboard = () => {
    let now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const [startDate, setStartDate] = useState(localStorage.getItem('date') ? new Date(Number(localStorage.getItem('date'))) : now);
    const [IsActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
    const [isFactorsModalOpen, setIsFactorsModalOpen] = useState(false);
    const [rerender, setRerender] = useState({activities: 0, factors: 0, tags: 0});

    useEffect(() => {
        localStorage.setItem('date', startDate.getTime().toString());
    }, [startDate]);

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/users/user/')
            .catch(() => {
                window.location.href = '/login';
            });
    }, []);

    const resetDate = () => {
        localStorage.removeItem('date');
        window.location.reload();
    };

    const openTagsModal = () => {
        setIsTagsModalOpen(true);
    };

    return (<Layout>
        <Modal isOpen={isFactorsModalOpen} onRequestClose={() => setIsFactorsModalOpen(false)} // Add this Modal
               style={{
                   content: {
                       width: '50%', height: '50%', margin: 'auto',
                   }
               }}>
            <FactorsList rerender={() => {
                setRerender((r) => (r.factors + 1))
            }}/>
        </Modal>

        <Modal isOpen={isTagsModalOpen} onRequestClose={() => setIsTagsModalOpen(false)} style={{
            content: {
                width: '50%', height: '50%', margin: 'auto',
            }
        }}>
            <TagsList rerender={() => {
                setRerender((r) => (r.tags + 1))
            }}/>
        </Modal>

        <Modal
            isOpen={IsActivityModalOpen}
            onRequestClose={() => setIsActivityModalOpen(false)}
            style={{
                content: {
                    width: '35%', height: '75%', margin: 'auto',
                }
            }}
        >
            <ActivityList rerender={() => {
                setRerender((r) => (r.activities + 1))
            }}/>
        </Modal>

        <div className="row" style={{marginBottom: "25px"}}>
            <div className="col">
                <div className="row">
                    <div className="col" style={{marginLeft: "25px"}}>
                        <input
                            style={{width: "200px"}}
                            className="form-control"
                            type="date"
                            value={startDate.toISOString().substr(0, 10)}
                            onChange={event => {
                                setStartDate(new Date(event.target.value));
                                window.location.reload();
                            }}
                        />
                    </div>
                    {startDate.toDateString() !== new Date().toDateString() && <div className="col">
                        <button className="button-orange" style={{marginLeft: "10px"}}
                                onClick={resetDate}>Вернуться к сегодняшнему дню
                        </button>
                    </div>}
                </div>
            </div>

            <div className="col-8">
                <button onClick={() => {
                    setIsFactorsModalOpen(true);
                }} className="button-light-blue">
                    <List/>Факторы
                </button>
                <button className="button-light-blue button-gap" style={{marginLeft: "10px"}}
                        onClick={() => {
                            setIsActivityModalOpen(true)
                        }}>
                    <List/> Активности
                </button>
                <button onClick={openTagsModal} className="button-light-blue">
                    <List/>Теги
                </button>
            </div>

        </div>


        <div className="row">
            <div className="col">
                <EventsList
                    created={[Math.floor(startDate.getTime() / 1000), Math.floor(startDate.getTime() / 1000 + 60 * 60 * 24)]}
                    finished={[Math.floor(startDate.getTime() / 1000), Math.floor(startDate.getTime() / 1000 + 60 * 60 * 24)]}
                    onMain={true}
                    rerender={rerender}
                />
            </div>
            <div className="col">
                <TaskList
                    created={[Math.floor(startDate.getTime() / 1000), Math.floor(startDate.getTime() / 1000 + 60 * 60 * 24)]}
                    finished={[Math.floor(startDate.getTime() / 1000), Math.floor(startDate.getTime() / 1000 + 60 * 60 * 24)]}
                    done="not done"
                    onMain={true}
                    rerender={rerender}
                />
            </div>
            <div className="col">
                <NoteList
                    created={[Math.floor(startDate.getTime() / 1000), Math.floor(startDate.getTime() / 1000 + 60 * 60 * 24)]}
                    finished={[Math.floor(startDate.getTime() / 1000), Math.floor(startDate.getTime() / 1000 + 60 * 60 * 24)]}
                    onMain={true}
                    rerender={rerender}
                />
            </div>
        </div>
    </Layout>);
};

export default Dashboard;