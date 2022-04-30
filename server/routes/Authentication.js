const { Router } = require('express');
const controller = require('../controllers/authController');
const router = Router();
const { validateToken } = require('../jwt');

// POST - Login user
router.post('/login', controller.login);

// POST - Authenticate session
// router.post('/isUserAuth', validateToken);

module.exports = router;
