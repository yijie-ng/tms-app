import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CreatePlan = () => {
  const [planStartDate, setPlanStartDate] = useState(new Date());
  const [planEndDate, setPlanEndDate] = useState(new Date());
  const [planMVPName, setPlanMVPName] = useState("");
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
      <div className="form-login">
        <h2 className="text-center mt-4">Create Plan</h2>
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
    </LocalizationProvider>
  );
};

export default CreatePlan;
