const { Router } = require('express');
const controllers = require('../controllers');
const router = Router();

// GET - List of user roles
router.get('/', controllers.userGroups);

module.exports = router;