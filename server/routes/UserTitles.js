const { Router } = require('express');
const controllers = require('../controllers');
const router = Router();

// GET - List of project roles
router.get('/user-titles', controllers.userTitles);

// GET - get all users' project roles
router.get('/users-titles', controllers.getUsersTitles);

// PUT - add new project roles to user
router.put('/users-titles/add', controllers.addProjectRoleToUser);
// PUT - update assign/unassign status (remove project roles from user)
router.put('/users-titles/remove', controllers.removeProjectRoleFromUser);

// GET - check if user is in a project role group
router.get('/checkgroup/:userTitle/:username', controllers.checkGroup);

module.exports = router;