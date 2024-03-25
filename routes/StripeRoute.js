const router = require('express').Router();
const Controller = require('../controllers/Stripe_Controller')

router.post("/payment", Controller.payment)






module.exports = router;
