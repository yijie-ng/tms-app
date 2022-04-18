const { Router } = require('express');
const controllers = require('../controllers');
const router = Router();

// POST - Login user
router.post('/login', controllers.login);

// POST - Create User
router.post('/register', controllers.createUser);

// GET - Log out user

module.exports = router;
