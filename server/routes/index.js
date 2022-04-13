const { Router } = require('express');
const controllers = require('../controllers');
const router = Router();

router.get('/', (req, res) => res.send('This is root!'));
router.post('/register', controllers.createUser);
router.post('/login', controllers.login);

module.exports = router;