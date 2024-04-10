import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SecretPage from './components/SecretPage';
import Logout from './components/Logout';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/secret" element={<SecretPage />} />
          <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;