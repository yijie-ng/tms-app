import React, { useState } from 'react';
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

function Navbar() {
    const { auth, setAuth } = useAuth();
    const handleLogout = () => {
        setAuth(null);
        localStorage.clear();
    }

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
                            <Link to="/update/user" className="dropdown-item">Update Email/Password</Link>
                            <Link to="/register" className="dropdown-item">Add New User</Link>
                            <a className="dropdown-item" href="#">Add New Group</a>
                        </div>
                    </li>
                </ul> : 
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
                        User Management
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link to="#" className="dropdown-item">Update Email/Password</Link>
                        </div>
                    </li>
                </ul>}
                <button className="btn btn-danger my-2 my-sm-0" onClick={handleLogout}>Sign Out</button>
              </nav>
            : <nav className="navbar navbar-dark bg-primary mb-4">
                <Link to="/" className="navbar-brand">Task Management App</Link>
                <button className="btn btn-danger my-2 my-sm-0" onClick={handleLogout}>Sign Out</button>
              </nav>
            : <nav className="navbar navbar-dark bg-primary mb-4">
                <Link to="/" className="navbar-brand">Task Management App</Link>
              </nav>
    )
}

export default Navbar;
