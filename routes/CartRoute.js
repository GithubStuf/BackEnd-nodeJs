const express = require('express');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../controllers/verifyToken');
const router = express.Router();

const Cart = require('../models/Cart')



//CREATE
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error)
    }
})


//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const updateCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json(updateCart)
    }catch(err){res.status(500).json(err)}
})

//Delete
router.delete('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart deleted successfully!')
    }catch(err){
        res.status(500).json(err)
    }
})

//GET USER CART
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json({cart});
    }catch(err){
        res.status(500).json(err)
    }
})

// //GET ALL
router.get('/', verifyTokenAndAdmin, async (req, res) =>{
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error)
    }
})



module.exports = router;