import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import useAuth from "../hooks/useAuth";

const CreatePlan = () => {
  const { auth } = useAuth();
  const [planStartDate, setPlanStartDate] = useState(new Date());
  const [planEndDate, setPlanEndDate] = useState(new Date());
  const [planMVPName, setPlanMVPName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const params = useParams();

  const [errMsg, setErrMsg] = useState("");

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/plan/create", {
        planMVPName: planMVPName,
        planStartDate: planStartDate,
        planEndDate: planEndDate,
        planAppAcronym: params.appAcronym,
        planDescription: planDescription,
        username: auth.username
      })
      .then((response) => {
        if (response.data.message === "New application plan created!") {
          alert(response.data.message);
          window.location.reload(true);
        } else {
          setErrMsg(response.data.message);
        }
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <button
        className="btn btn-primary ml-3"
        data-toggle="modal"
        data-target="#addPlan"
      >
        Create Plan
      </button>
      <div
        className="modal fade"
        id="addPlan"
        tabIndex="-1"
        aria-labelledby="addPlanLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addPlanLabel">
                <b>Create New Plan</b>
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div
                  className={errMsg ? "alert alert-info" : "offscreen"}
                  role="alert"
                >
                  {errMsg}
                </div>
                <div className="form-group">
                  <label htmlFor="planMVPName">Plan Name:</label>
                  <input
                    className="form-control"
                    type="text"
                    id="planMVPName"
                    autoComplete="off"
                    required
                    onChange={(e) => setPlanMVPName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="planDesc">Description:</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    id="planDesc"
                    autoComplete="off"
                    required
                    onChange={(e) => setPlanDescription(e.target.value)}
                  />
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <DatePicker
                      label="Start Date"
                      openTo="day"
                      views={["day", "month", "year"]}
                      value={planStartDate}
                      onChange={(newValue) => {
                        setPlanStartDate(newValue.format("YYYY-MM-DD"));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          helperText={params?.inputProps?.placeholder}
                        />
                      )}
                    />
                  </div>
                  <div className="col">
                    <DatePicker
                      label="End Date"
                      openTo="day"
                      views={["day", "month", "year"]}
                      value={planEndDate}
                      onChange={(newValue) => {
                        setPlanEndDate(newValue.format("YYYY-MM-DD"));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          helperText={params?.inputProps?.placeholder}
                        />
                      )}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Submit
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default CreatePlan;
