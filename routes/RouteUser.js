const router = require('express').Router();

const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../controllers/verifyToken');

const Controller = require('../controllers/Users_Controller')

//UPDATE
router.put('/:id', verifyTokenAndAuthorization, Controller.updateUser )

//Delete
router.delete('/:id', verifyTokenAndAuthorization, Controller.deleteUser)

//GET USER
router.get('/find/:id', verifyTokenAndAdmin, Controller.findUserById)

//GET ALL USER
router.get('/', verifyTokenAndAdmin, Controller.getAllUsers)


//GET USER STATS
router.get('/stats', verifyTokenAndAdmin, Controller.getUserStats)


module.exports = router;