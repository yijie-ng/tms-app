import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import axios from 'axios';
import User from './User';

function Dashboard() {
  const { auth } = useAuth();

  return (
    <div className='container'>
      <h2>Hello, {auth.username}!</h2>
      <Link to="/register" className="btn btn-primary" role="button">Add User</Link>
      <div className="mt-3">
        <h4>User Management</h4>
        <User />
      </div>
    </div>
  )
}

export default Dashboard
