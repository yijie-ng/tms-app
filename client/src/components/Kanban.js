import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios';
import { ListItem } from '@mui/material';
import useAuth from '../hooks/useAuth';
import CreateTask from './CreateTask';

const Kanban = () => {
  const { auth } = useAuth();
  const [openTasks, setOpenTasks] = useState([]);
  const [appPermitCreate, setAppPermitCreate] = useState([]);
  // const [todoTasks, setTodoTasks] = useState([]);
  // const [doingTasks, setDoingTasks] = useState([]);
  // const [doneTasks, setDoneTasks] = useState([]);
  // const [closedTasks, setClosedTasks] = useState([]);
  const params = useParams();
  const appAcronym = params.appAcronym;

  const lists = ['Open', 'To-do-list', 'Doing', 'Done', 'Close'];

  const [networkStatus, setNetworkStatus] = useState("pending");

  const onDragEnd = (result) => {
    console.log(result);
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const getData = async () => {
      try {
        const openTasksList = await axios.get(`http://localhost:3001/api/tasks/${appAcronym}/open`);
        const app = await axios.get(`http://localhost:3001/api/app/${appAcronym}`);
        setOpenTasks(openTasksList.data);
        setAppPermitCreate(app.data[0].app_permit_create);
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
        <>
          <div className='container'>
            {appPermitCreate.includes(',') ? (
              appPermitCreate.split(',').map((group) => {
                auth.projectRoles.includes(group) ? <CreateTask /> : null
              })
            ) : auth.projectRoles.includes(appPermitCreate) ? <CreateTask /> : null}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
              <DropContainer />
          </DragDropContext>
        </>
      ) : null}
    </>
  )
}

export default Kanban
