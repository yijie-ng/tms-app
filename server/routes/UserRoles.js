const { Router } = require('express');
const controllers = require('../controllers');
const router = Router();

// GET - List of account type
router.get('/', controllers.userRoles);

module.exports = router;