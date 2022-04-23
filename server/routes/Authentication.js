const { Router } = require('express');
const controllers = require('../controllers');
const router = Router();
const { validateToken } = require('../jwt');

// POST - Login user
router.post('/login', controllers.login);

// POST - Create User
router.post('/register', validateToken, controllers.createUser);

module.exports = router;
