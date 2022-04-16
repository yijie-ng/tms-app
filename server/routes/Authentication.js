const { Router } = require('express');
const controllers = require('../controllers');
const router = Router();

// GET - 
router.get('/', controllers.loginSession);

// POST
router.post('/', controllers.login);

module.exports = router;
