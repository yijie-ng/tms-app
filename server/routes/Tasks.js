const { Router } = require('express');
const router = Router();
const controller = require('../controllers/taskController');
const { validateToken } = require('../jwt');

// GET - all tasks by app acronym and state
router.get('/tasks/:appAcronym/open', validateToken, controller.getOpenTasksByAppAcronym);
router.get('/tasks/:appAcronym/todo', validateToken, controller.getTodoTasksByAppAcronym);
router.get('/tasks/:appAcronym/doing', validateToken, controller.getDoingTasksByAppAcronym);
router.get('/tasks/:appAcronym/done', validateToken, controller.getDoneTasksByAppAcronym);
router.get('/tasks/:appAcronym/close', validateToken, controller.getCloseTasksByAppAcronym);
// GET - All tasks by app acronym
router.get('/tasks/:appAcronym', validateToken, controller.getTasksByAppAcronym);
// GET /task-notes - All task notes
router.get('/task-notes', validateToken, controller.getAllTaskNotes);
// GET /tasks/permissions/:appAcronym - Task permissions of an app
router.get('/tasks/permissions/:appAcronym', validateToken, controller.taskPermissions);

// POST - /tasks/create - Create task
router.post('/tasks/create', validateToken, controller.addNewTask);
// POST - /task-notes/create - add task notes
router.post('/task-notes/create', validateToken, controller.addNewTaskNotes);

// PUT - /tasks/update-state/:taskId
router.put('/tasks/update-state/:taskId', validateToken, controller.updateTaskState);
// PUT - /tasks/update/:taskId - updated task description, task plan
router.put('/tasks/update/:taskId', validateToken, controller.updateTask);

module.exports = router;