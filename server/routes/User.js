const { Router } = require('express');
const controllers = require('../controllers');
const { validateToken } = require('../jwt');
const router = Router();

// GET - All users
router.get('/', validateToken, controllers.users);

// GET - User by Id
router.get('/:id', validateToken, controllers.userById);

// PUT - Update User
router.put('/update-email/:id', validateToken, controllers.updateUserEmail);
router.put('/update-password/:id', validateToken, controllers.updateUserPassword);
router.put('/update-user/:id', validateToken, controllers.updateUserInfo);
router.put('/update-status/:id', validateToken, controllers.updateUserStatus);

module.exports = router;