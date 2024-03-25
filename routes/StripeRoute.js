const router = require('express').Router();
const Controller = require('../controllers/Users_Controller')

router.post("/payment", Controller.Payment)






module.exports = router;
