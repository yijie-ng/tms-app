const { Router } = require('express');
const controller = require('../controllers/userController');
const { validateToken } = require('../jwt');
const router = Router();

// GET - All users
router.get('/', validateToken, controller.users);

// GET - User by Id
router.get('/:id', validateToken, controller.userById);

// POST - Create User
router.post('/register', validateToken, controller.createUser);

// PUT - Update User
router.put('/update-email/:id', validateToken, controller.updateUserEmail);
router.put('/update-password/:id', validateToken, controller.updateUserPassword);
router.put('/update-user/:id', validateToken, controller.updateUserInfo);
// router.put('/update-status/:id', validateToken, controller.updateUserStatus);

module.exports = router;