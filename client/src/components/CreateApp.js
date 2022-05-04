import React from 'react'

const CreateApp = () => {
  return (
    <div className='container'>
      <div className='row justify-content-center'>
          <div className='col-xs-12 col-sm-4 col-sm-offset-4'>
              <div className='form-login'>
                <h2 className="text-center mt-4">Create Application Project</h2>
                <form>
                    <div className='form-group'>
                        <label htmlFor='appAcronym'>App Acronym:</label>
                        <input 
                            className='form-control'
                            type='text'
                            id='appAcronym'
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='appAcronym'>App Description:</label>
                        <input 
                            className='form-control'
                            type='textarea'
                            id='appAcronym'
                            required
                        />
                    </div>
                    <button type='submit' className='btn btn-primary btn-block'>Submit</button>
                </form>
              </div>
          </div>
      </div>
    </div>
  )
}

export default CreateApp
