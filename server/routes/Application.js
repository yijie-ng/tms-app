const { Router } = require('express');
const router = Router();
const controller = require('../controllers/appController');
const { validateToken } = require('../jwt');

// GET

// POST
router.post('/create', validateToken, controller.addNewApp);

module.exports = router;