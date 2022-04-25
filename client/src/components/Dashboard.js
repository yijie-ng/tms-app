import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import User from "./User";
import Users from "./Users";

function Dashboard() {
  const { auth } = useAuth();

  return (
    <div className="container">
      <h1 className="mt-4"><b>Hello, {auth.username}!</b></h1>
      {/* <Link to="/register" className="btn btn-primary" role="button">Add User</Link> */}
      <div className="mt-4">
        <h3><b>User Management</b></h3>
        <h4 className="mt-3 mb-2"><b>My Account</b></h4>
        <User />
      </div>
      {auth.userRole === "Admin" ? (
        <div className="mt-4">
          <h4 className="mt-3 mb-2"><b>All Users</b></h4>
          <Users />
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
