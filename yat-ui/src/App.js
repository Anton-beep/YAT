import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SecretPage from './components/SecretPage';
import Logout from './components/Logout';
import EventList from "./components/EventList";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/secret" element={<SecretPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="eventList/" element={<EventList created={['123', '123']} finished={['123', '123']} />} />
      </Routes>
    </Router>
  );
}

export default App;