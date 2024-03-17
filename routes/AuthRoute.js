const router = require('express').Router();
const Controller = require('../controllers/Auth_Controller')

router.post('/register', Controller.addUser);
router.post('/login', Controller.authUser);


module.exports = router;