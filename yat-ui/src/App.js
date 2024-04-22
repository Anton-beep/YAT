import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import SecretPage from './components/SecretPage';
import Logout from './components/Logout';
import EventList from "./components/EventList";
import Homepage from './components/Homepage';
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Restoration from "./components/Restoration/Restoration";
import Confirm from "./components/Confirm/Confirm";
import Dashboard from './components/Dashboard/Dashboard';
import Statistics from './components/Statistics/Statistics';

import './bootstrap/bootstrap.min.css';
import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';

import './App.css'
import TaskList from "./components/TaskList/TaskList";
import ActivityList from "./components/ActivityList/ActivityList";
import EventsList from "./components/EventList";
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
    return (
    <Router>
        <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/forgotpassword" element={<ForgotPassword/>}/>
            <Route path="/confirm/:token" element={<Confirm/>}/>
            <Route path="/confirm/:token/:email" element={<Confirm/>}/>
            <Route path="/restoration/:token" element={<Restoration/>}/>
            <Route path="/register" element={<RegisterForm/>}/>
            <Route path="/secret" element={<SecretPage/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/statistics" element={<Statistics/>}/>
        </Routes>
    </Router>
);
}

export default App;