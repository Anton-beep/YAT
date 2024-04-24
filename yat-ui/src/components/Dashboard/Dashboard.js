import React, {useEffect, useState} from 'react';
import './Dashboard.css';
import Layout from "./../Layout";
import EventsList from "../EventList";
import TasList from "../TaskList/TaskList";
import AddTagForm from "../AddTagForm/AddTagForm";
import AddFactorForm from "../AddFactorForm/AddFactorForm";
import {ReactComponent as Plus} from "../../icons/plus-lg.svg";
import {ReactComponent as List} from "../../icons/list.svg";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import AddActivityForm from "../AddActivityForm/AddActivityForm";
import ActivityList from "../ActivityList/ActivityList";
import Auth from "../../pkg/auth";
import TagsList from "../TagsList/TagsList";
import FactorsList from "../FactorsList/FactorsList";

const Dashboard = () => {
    let now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const [startDate, setStartDate] = useState(localStorage.getItem('date') ? new Date(Number(localStorage.getItem('date'))) : now);
    const [addTagFormOpen, setAddTagFormOpen] = useState(false);
    const [addFactorFormOpen, setAddFactorFormOpen] = useState(false);
    const [IsActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
    const [isFactorsModalOpen, setIsFactorsModalOpen] = useState(false);

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
            <FactorsList/>
        </Modal>

        <Modal isOpen={isTagsModalOpen} onRequestClose={() => setIsTagsModalOpen(false)} style={{
            content: {
                width: '50%', height: '50%', margin: 'auto',
            }
        }}>
            <TagsList/>
        </Modal>

        <Modal
            isOpen={addTagFormOpen}
            onRequestClose={() => setAddTagFormOpen(false)}
            style={{
                content: {
                    width: '25%', height: '30%', margin: 'auto',
                }
            }}
        >
            <AddTagForm/>
        </Modal>

        <Modal
            isOpen={addFactorFormOpen}
            onRequestClose={() => setAddFactorFormOpen(false)}
            style={{
                content: {
                    width: '35%', height: '30%', margin: 'auto',
                }
            }}
        >
            <AddFactorForm/>
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
            <ActivityList/>
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
                    </div>
                    }
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
                <EventsList created={[Math.floor(startDate.getTime() / 1000), Math.floor(startDate.getTime() / 1000 + 60 * 60 * 24)]}
                            finished={[Math.floor(startDate.getTime() / 1000), Math.floor(startDate.getTime() / 1000 + 60 * 60 * 24)]}
                            onMain={true}
                />
            </div>
            <div className="col">
                <TasList created={[Math.floor(startDate.getTime() / 1000), Math.floor(startDate.getTime() / 1000 + 60 * 60 * 24)]}
                         finished={[Math.floor(startDate.getTime() / 1000), Math.floor(startDate.getTime() / 1000 + 60 * 60 * 24)]}
                         done="not done"
                         onMain={true}
                />
            </div>
        </div>
    </Layout>);
};

export default Dashboard;