const { Router } = require('express');
const router = Router();
const controller = require('../controllers/planController');
const { validateToken } = require('../jwt');

// GET - All plans
router.get('/plans', validateToken, controller.getPlans);

// GET - Plan by app_acronym
router.get('/plans/:appAcronym', validateToken, controller.getPlanByApp);

// GET - /plans/:appAcronym/:planName - Plan by app acronym and plan name
router.get('/plans/:appAcronym/:planName', validateToken, controller.getPlanByAppAndName);

// POST - Create new plan for app
router.post('/plan/create', validateToken, controller.addNewPlan);

// UPDATE
router.put('/plan/update/:appAcronym/:planName', validateToken, controller.updatePlan);

module.exports = router;