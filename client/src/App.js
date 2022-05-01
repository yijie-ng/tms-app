import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';
import Unauthorized from './components/Unauthorized';
import UpdateUser from './components/UpdateUser';
import AdminUpdateUser from './components/AdminUpdateUser';

function App() {

  return (
    <div className="App">
      <Navbar />
        <Routes>
          {/* public routes */}
          <Route path="/" element={ <Home /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/unauthorized" element={ <Unauthorized />} />
          {/* <Route path="/register" element={ <Register /> } /> */}

          {/* protected routes */}
          <Route element={<RequireAuth allowedRoles={['Admin', 'User']} />}>
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="/update/user" element={ <UpdateUser />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin']} />}>  
            <Route path="/register" element={ <Register /> } />
            <Route path="/admin/update/user" element={ <AdminUpdateUser /> } />
          </Route>
        </Routes>
    </div>
  );
}

export default App;
