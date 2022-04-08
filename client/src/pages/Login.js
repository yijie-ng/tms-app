import React from 'react'

function Login() {
  return (
    <div>
      <div className='login'>
          <h1>Login</h1>
          <label>Username</label>
          <input type='text' placeholder='Username...' />
          <label>Password</label>
          <input type='password' placeholder='Password...' />
          <button>Login</button>
      </div>
    </div>
  )
}

export default Login;
