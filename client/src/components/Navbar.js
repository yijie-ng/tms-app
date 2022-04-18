import React from 'react'

function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-primary mb-4">
        {/*put router link here*/}
        <a className="navbar-brand" href="#">Task Management App</a>
        {/* <button className="btn btn-danger my-2 my-sm-0">Sign Out</button> */}
    </nav>
  )
}

export default Navbar;
