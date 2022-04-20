import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';
import Unauthorized from './components/Unauthorized';

function App() {
  return (
    <div className="App">
      <Navbar />
        <Routes>
          {/* public routes */}
          <Route path="/" element={ <Home /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/unauthorized" element={ <Unauthorized />} />

          {/* protected routes */}
          <Route element={<RequireAuth allowedRoles={['Admin', 'User']} />}>
            <Route path="/dashboard" element={ <Dashboard /> } />
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin']} />}>  
            <Route path="/register" element={ <Register /> } />
          </Route>
        </Routes>
    </div>
  );
}

export default App;
