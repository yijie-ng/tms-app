import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import moment from "moment";
import CreatePlan from "./CreatePlan";
import useAuth from "../hooks/useAuth";

const Plans = () => {
  const { auth } = useAuth();
  const [appPlansData, setAppPlansData] = useState([]);
  const [appData, setAppData] = useState([]);
  const [networkStatus, setNetworkStatus] = useState("pending");
  const params = useParams();
  const planAppAcronym = params.appAcronym;

  console.log(auth.projectRoles.includes("Project Manager"));

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const getData = async () => {
      try {
        const appPlans = await axios.get(
          `http://localhost:3001/api/plans/${planAppAcronym}`
        );
        const app = await axios.get(
          `http://localhost:3001/api/app/${planAppAcronym}`
        );
        setAppPlansData(appPlans.data);
        setAppData(app.data);
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
          <div className="mb-4">
            <h1>
              <b>{planAppAcronym}</b>
            </h1>
            <Typography
              sx={{ fontSize: 18, fontFamily: "Nunito" }}
              color="text.secondary"
            >
              {appData[0].app_description}
            </Typography>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-sm-offset-4">
              <h2>All Plans</h2>
              {appPlansData.length > 0 ? (
                appPlansData.map((plan) => {
                  return (
                    <>
                      <Card>
                        <CardContent>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            APP_ACRONYM: {plan.plan_app_acronym}
                          </Typography>
                          <Typography variant="h5" component="div">
                            {plan.plan_MVP_name}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Start Date:{" "}
                            {moment
                              .utc(plan.plan_startDate)
                              .format("MMM Do, YYYY")}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            End Date:{" "}
                            {moment
                              .utc(plan.plan_endDate)
                              .format("MMM Do, YYYY")}
                          </Typography>
                        </CardContent>
                      </Card>
                    </>
                  );
                })
              ) : (
                <h5>No plans created!</h5>
              )}
            </div>
            {auth.projectRoles.includes("Project Manager") ? (
                <div className="col-xs-12 col-sm-6 col-sm-offset-4">
                    <CreatePlan />
                </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Plans;
