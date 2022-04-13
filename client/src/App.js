import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="App">
      <h1>TMS App</h1>
        <Routes>
          <Route path="/" element={ <Home/> } />
          <Route path="/dashboard" element={ <Dashboard/> } />
          <Route path="/login" element={ <Login/> } />
          <Route path="/register" element={ <Register/> } />
        </Routes>
    </div>
  );
}

export default App;
