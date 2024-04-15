import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import SecretPage from './components/SecretPage';
import Logout from './components/Logout';
import EventList from "./components/EventList";
import Homepage from './components/Homepage';
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Restoration from "./components/Restoration/Restoration";

import './bootstrap/bootstrap.min.css';
import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';

import './App.css'

function App() {
    return (
    <Router>
        <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/forgotpassword" element={<ForgotPassword/>}/>
            <Route path="/restoration" element={<Restoration/>}/>
            <Route path="/register" element={<RegisterForm/>}/>
            <Route path="/secret" element={<SecretPage/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="eventList/" element={<EventList created={['123', '123']} finished={['123', '123']}/>}/>
        </Routes>
    </Router>
)
    ;
}

export default App;