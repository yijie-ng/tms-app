import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

const UpdatePlan = () => {
  const [planStartDate, setPlanStartDate] = useState();
  const [planEndDate, setPlanEndDate] = useState();
  const [planDescription, setPlanDescription] = useState();
  const params = useParams();
  const appAcronym = params.appAcronym;
  const planName = localStorage.getItem("Plan");
  const [errMsg, setErrMsg] = useState("");
  const [networkStatus, setNetworkStatus] = useState("pending");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const getData = async () => {
      try {
        const plan = await axios.get(
          `http://localhost:3001/api/plans/${appAcronym}/${planName}`
        );
        setPlanStartDate(
          moment(plan.data[0].plan_startDate).format("YYYY-MM-DD")
        );
        setPlanEndDate(moment(plan.data[0].plan_endDate).format("YYYY-MM-DD"));
        setPlanDescription(plan.data[0].plan_description);
        setNetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3001/api/plan/update/${appAcronym}/${planName}`, {
        planDescription: planDescription,
        planStartDate: planStartDate,
        planEndDate: planEndDate,
      })
      .then((response) => {
        if (response.data.message === "Plan updated!") {
          alert(response.data.message);
          window.location.reload(true);
        } else {
          setErrMsg(response.data.message);
        }
      });
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <form onSubmit={handleSubmit} className="mb-3">
          <div
            className={errMsg ? "alert alert-info" : "offscreen"}
            role="alert"
          >
            {errMsg}
          </div>
          <span>
            <b>Update Plan</b>
          </span>
          <div className="form-group">
            <label htmlFor="planDesc">Plan Description:</label>
            <textarea
              className="form-control"
              rows="3"
              id="planDesc"
              autoComplete="off"
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
            />
          </div>
          <div className="row mt-3 mb-3">
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
      </LocalizationProvider>
    </>
  );
};

export default UpdatePlan;
