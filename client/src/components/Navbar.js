import React from 'react';
import useAuth from "../hooks/useAuth";

function Navbar() {
    const { auth } = useAuth();

    return (
        // <div className="collapse navbar-collapse" id="navbarSupportedContent">
        //     <ul className="navbar-nav mr-auto">
        //         <li className="nav-item dropdown">
        //             <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
        //             User Management
        //             </a>
        //             <div className="dropdown-menu" aria-labelledby="navbarDropdown">
        //                 {/*put router link here*/}
        //             <a className="dropdown-item" href="#">Update Email/Password</a>
        //             <a className="dropdown-item" href="#">Add New User</a>
        //             </div>
        //         </li>
        //         <li>
        //             <button className="btn btn-danger my-2 my-sm-0">Sign Out</button>
        //         </li>
        //     </ul>
        // </div>
        auth?.username 
            ? <nav className="navbar navbar-dark bg-primary mb-4">
                {/*put router link here*/}
                <a className="navbar-brand" href="#">Task Management App</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <button className="btn btn-danger my-2 my-sm-0">Sign Out</button>
              </nav>
            : <nav className="navbar navbar-dark bg-primary mb-4">
                {/*put router link here*/}
                <a className="navbar-brand" href="#">Task Management App</a>
              </nav>
    )
}

export default Navbar;
