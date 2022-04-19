import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
        <Routes>
          {/* public routes */}
          <Route path="/" element={ <Home/> } />
          <Route path="/login" element={ <Login/> } />

          {/* protected routes */}
          <Route path="/dashboard" element={ <Dashboard/> } />
          <Route path="/register" element={ <Register/> } />
        </Routes>
    </div>
  );
}

export default App;
