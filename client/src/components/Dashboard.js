import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from "../hooks/useAuth";

function Dashboard() {
  const { auth } = useAuth();

  return (
    <div className='container'>
      <h2>Hello, {auth.username}!</h2>
      <Link to="/register">Add User</Link>
    </div>
  )
}

export default Dashboard
