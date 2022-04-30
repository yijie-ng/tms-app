const { Router } = require('express');
const controller = require('../controllers/userRolesController');
const router = Router();
const { validateToken } = require('../jwt');

// GET - List of account type
router.get('/', validateToken, controller.userRoles);

module.exports = router;