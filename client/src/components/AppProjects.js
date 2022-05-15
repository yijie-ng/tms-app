import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import moment from "moment";
import useAuth from "../hooks/useAuth";

const AppProjects = () => {
  const { auth } = useAuth();
  const [appData, setAppData] = useState([]);

  const [networkStatus, setNetworkStatus] = useState("pending");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const getData = async () => {
      try {
        const getAppData = await axios.get("http://localhost:3001/api/app");
        setAppData(getAppData.data);
        setNetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, []);

  return (
    <>
    {networkStatus === "resolved" ? (
      <div className="container">
        <h1 className="mb-4">
          <b>All Application Projects</b>
        </h1>
        {auth.projectRoles.includes("Project Manager") ? (
          <Link to="/applications/create">
            <button className="btn btn-primary mb-3">Create App</button>
          </Link>
        ) : null}
        <div className="row row-cols-3">
          {appData.length > 0 ? (
            appData.map((app) => {
                  return (
                    <>
                    <div className="col">
                      <Card key={app.app_acronym}>
                          <CardContent>
                          <Typography
                              sx={{ fontSize: 14 }}
                              color="text.secondary"
                              gutterBottom
                          >
                              APP RUNNING NO.: {app.app_Rnumber}
                          </Typography>
                          <Typography variant="h5" component="div">
                              {app.app_acronym}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                              Start Date:{" "}
                              {moment(app.app_startDate).format("LL")}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                              End Date:{" "}
                              {moment(app.app_endDate).format("LL")}
                          </Typography>
                          <Typography variant="body1">{app.app_description}</Typography>
                          </CardContent>
                          <CardActions>
                              <Link to={`/applications/${app.app_acronym}/kanban`}>
                                <Button size="small">View Kanban</Button>
                              </Link>
                              {auth.projectRoles.includes("Project Manager") ? (
                                <Button size="small" color="error">Edit App</Button>
                              ) : null}
                          </CardActions>
                      </Card>
                    </div>
                    </>
                  );
                })
          ) : <h5>No application projects!</h5>}
        </div>
      </div>
    ) : null}
    </>
  );
};

export default AppProjects;
