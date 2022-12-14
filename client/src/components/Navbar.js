import React, { useState } from 'react';
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import axios from 'axios';

function Navbar() {
    const { auth, setAuth } = useAuth();
    
    const handleLogout = () => {
        setAuth(null);
        // localStorage.clear();
        axios.get("http://localhost:3001/api/auth/logout");
    };

    return (
        // <nav className="navbar navbar-dark bg-primary mb-4">
        //     <a className="navbar-brand" href="#">Task Management App</a>
        //     <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        //         <span className="navbar-toggler-icon"></span>
        //     </button>
        //     <div class="collapse navbar-collapse" id="navbarSupportedContent">
        //         <ul className="navbar-nav mr-auto">
        //         </ul>
        //     </div>
        // </nav>
        // <div className="collapse navbar-collapse" id="navbarSupportedContent">

        // </div>
        auth?.username
            ? auth.userStatus === 'active'
            ? <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
                <Link to="/" className="navbar-brand">Task Management App</Link>
                {auth.userRole === 'Admin' ?
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
                        User Management
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link to="/register" className="dropdown-item">Add New User</Link>
                            <Link to="/admin/project-roles/create" className="dropdown-item">Create New Project Role</Link>
                        </div>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
                            Application Projects
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link to="/applications" className="dropdown-item">All App Projects</Link>
                            {auth.projectRoles.includes("Project Manager") ? (
                                <Link to="/applications/create" className="dropdown-item">Create New App Project</Link>
                                ) : null}
                        </div>
                    </li>
                </ul> : 
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
                            Application Projects
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link to="/applications" className="dropdown-item">All App Projects</Link>
                            {auth.projectRoles.includes("Project Manager") ? (
                                <Link to="/applications/create" className="dropdown-item">Create New App Project</Link>
                                ) : null}
                        </div>
                    </li>
                    {/* <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
                        User Management
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link to="#" className="dropdown-item">Update Email/Password</Link>
                        </div>
                    </li> */}
                </ul>}
                <span className="nav-item my-2 my-lg-0 mr-3" style={{ color: 'white' }}>Hi, {auth.username}!</span>
                <button className="btn btn-danger my-2 my-sm-0" onClick={handleLogout}>Sign Out</button>
              </nav>
            : <nav className="navbar navbar-dark bg-primary mb-4">
                <Link to="/" className="navbar-brand">Task Management App</Link>
                <span className="nav-item my-2 my-lg-0 mr-3" style={{ color: 'white' }}>Hi, {auth.username}!</span>
                <button className="btn btn-danger my-2 my-sm-0" onClick={handleLogout}>Sign Out</button>
              </nav>
            : <nav className="navbar navbar-dark bg-primary mb-4">
                <Link to="/" className="navbar-brand">Task Management App</Link>
              </nav>
    )
}

export default Navbar;
