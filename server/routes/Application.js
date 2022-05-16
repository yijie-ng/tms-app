const { Router } = require('express');
const router = Router();
const controller = require('../controllers/appController');
const { validateToken } = require('../jwt');

// GET
router.get('/app', validateToken, controller.getAllApps);

// GET - App by acronym
router.get('/app/:appAcronym', validateToken, controller.getAppByAcronym);

// POST
router.post('/app/create', validateToken, controller.addNewApp);

// PUT /app/:appAcronym/update - update app
router.put('/app/:appAcronym/update', validateToken, controller.updateApp);

module.exports = router;