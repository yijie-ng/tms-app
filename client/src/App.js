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
import AppProjects from './components/AppProjects';
import CreateApp from './components/CreateApp';
import CreateProjectRole from './components/CreateProjectRole';
import Plans from './components/Plans';
import Kanban from './components/Kanban';

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
            <Route path="/update/user" element={ <UpdateUser />} />
            <Route path="/applications" element={ <AppProjects /> } />
            <Route path="/applications/create" element={<CreateApp />} />
            <Route path="/applications/:appAcronym/plans" element={<Plans />} />
            <Route path="/applications/:appAcronym/kanban" element={<Kanban />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin']} />}>  
            <Route path="/register" element={ <Register /> } />
            <Route path="/admin/update/user" element={ <AdminUpdateUser /> } />
            <Route path="/admin/project-roles/create" element={ <CreateProjectRole /> } />
          </Route>
        </Routes>
    </div>
  );
}

export default App;
