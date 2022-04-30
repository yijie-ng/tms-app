const { Router } = require('express');
const controller = require('../controllers/userTitlesController');
const router = Router();
const { validateToken } = require('../jwt');

// GET - List of project roles
router.get('/user-titles', validateToken, controller.userTitles);

// GET - get all users' project roles
router.get('/users-titles', validateToken, controller.getUsersTitles);

// PUT - add new project roles to user
router.put('/users-titles/add', validateToken, controller.addProjectRoleToUser);

// PUT - update assign/unassign status (remove project roles from user)
router.put('/users-titles/remove', validateToken, controller.removeProjectRoleFromUser);

// GET - check if user is in a project role group
router.get('/checkgroup/:userTitle/:username', validateToken, controller.checkGroup);

module.exports = router;