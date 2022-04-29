const { Router } = require('express');
const controllers = require('../controllers');
const router = Router();

// GET - List of project groups
router.get('/user-groups', controllers.userGroups);

// POST - add new project group
router.post('/user-groups', controllers.addUserGroup);

// GET - List of user's project groups
// router.get('/:username', controllers.getUsersUserGroups);

// GET all users' project groups
router.get('/usersgroups', controllers.getUsersGroups);

module.exports = router;