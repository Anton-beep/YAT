import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Layout from "./../Layout";
import EventsList from "../EventList";
import TasList from "../TaskList/TaskList";
import AddTagForm from "../AddTagForm/AddTagForm";
import AddFactorForm from "../AddFactorForm/AddFactorForm";
import { Chart } from "react-google-charts";
import {ReactComponent as Plus} from "../../icons/plus-lg.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {createBrowserRouter} from "react-router-dom";
import Modal from "react-modal";

const Dashboard = () => {
    const [startDate, setStartDate] = useState(localStorage.getItem('date') ? new Date(localStorage.getItem('date')) : new Date());
    const [addTagFormOpen, setAddTagFormOpen] = useState(false);
    const [addFactorFormOpen, setAddFactorFormOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('date', startDate.toISOString());
    }, [startDate]);

    const resetDate = () => {
        setStartDate(new Date());
        window.location.reload();
    };

    return (
        <Layout>

            <Modal
                isOpen={addTagFormOpen}
                onRequestClose={() => setAddTagFormOpen(false)}
                style={{
                    content: {
                        width: '25%',
                        height: '50%',
                        margin: 'auto',
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
                        width: '35%',
                        height: '50%',
                        margin: 'auto',
                    }
                }}
            >
                <AddFactorForm/>
            </Modal>

            <div className="row">

                <div className="col-6" style={{marginLeft: "10px"}}>
                    Дата{" "}
                    <DatePicker selected={startDate} onChange={date => {
                        setStartDate(date);
                        window.location.reload();
                    }}/>
                    {startDate.toDateString() !== new Date().toDateString() &&
                        <button className="button-light-blue" style={{marginLeft: "10px"}} onClick={resetDate}>Сбросить
                            дату</button>
                    }
                </div>

                <div className="col-5">
                    <button className="button-light-blue button-gap" style={{marginLeft: "10px"}}
                            onClick={() => {setAddTagFormOpen(true)}}>
                        <Plus /> Добавить тег
                    </button>
                    <button className="button-light-blue button-gap" style={{marginLeft: "10px"}}
                            onClick={() => {setAddFactorFormOpen(true)}}>
                        <Plus/> Добавить фактор
                    </button>
                </div>

            </div>


            <div className="row">
                <div className="col-6">
                    <EventsList created={Math.floor(startDate.getTime() / 1000)}
                                finished={Math.floor(startDate.getTime() / 1000)}/>
                </div>
                <div className="col-6">
                    <TasList created={Math.floor(startDate.getTime() / 1000)}
                             finished={Math.floor(startDate.getTime() / 1000)}/>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;