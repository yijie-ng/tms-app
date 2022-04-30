const { Router } = require('express');
const controller = require('../controllers/authController');
const router = Router();
const { validateToken } = require('../jwt');

// POST - Login user
router.post('/login', controller.login);

// GET - logout
router.get('/logout', controller.logout);

// POST - Authenticate session
// router.post('/isUserAuth', validateToken);

module.exports = router;
