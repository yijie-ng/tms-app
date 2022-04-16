const { Router } = require('express');
const controllers = require('../controllers');
const router = Router();

// GET

// POST - Create User
router.post('/', controllers.createUser);

// PUT - Update User

module.exports = router;