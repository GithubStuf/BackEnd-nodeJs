const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../controllers/verifyToken');

const Order = require('../models/Order');


//CREATE
router.post('/', verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error)
    }
})


//UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json(updateOrder)
    }catch(err){res.status(500).json(err)}
})

//Delete
router.delete('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order deleted successfully!')
    }catch(err){
        res.status(500).json(err)
    }
})

//GET USER ORDER
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const orders = await Order.find({userId: req.params.userId});
        res.status(200).json({orders});
    }catch(err){
        res.status(500).json(err)
    }
})

//GET ALL
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    // Handle validation errors with a more informative message
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].properties.message;
      }
      res.status(400).json({ message: 'Validation failed!', errors: validationErrors });
    } else {
      // Handle other errors (e.g., database errors)
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});


//GET MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const data = await Order.aggregate([
            {$match: {createdAt: {$gte: previousMonth}}},
            {
                $project: {
                    month: { $month: "$createdAt"},
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month" ,
                    total: {$sum: "$sales"},
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router;
