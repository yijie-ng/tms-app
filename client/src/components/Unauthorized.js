import React from 'react';
import { useNavigate } from 'react-router-dom';

function Unauthorized() {
    const navigate = useNavigate();
    const goDashboard = () => navigate('/dashboard');

    return (
        <div className='container'>
            <h2>Unauthorized</h2>
            <br />
            <p>You do not have access to the requested page.</p>
            <div className="flexGrow">
                <button className="btn btn-primary" onClick={goDashboard}>Back to Dashboard</button>
            </div>
        </div>
    )
}

export default Unauthorized
