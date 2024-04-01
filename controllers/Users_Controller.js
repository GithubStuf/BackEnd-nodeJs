const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');

const User = require('../models/Users');


const updateUser = async (req, res)=>{
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
    }
    try{
        const updateUser = await Users.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json(updateUser)
    }catch(err){res.status(500).json(err)}
}

const deleteUser = async (req, res)=>{
    try{
        await Users.findByIdAndDelete(req.params.id);
        res.status(200).json('User deleted successfully!')
    }catch(err){
        res.status(500).json(err)
    }
}

const findUserById = async (req, res)=>{
    try{
        const user = await Users.findById(req.params.id);
        const {password, ...others}=user._doc;
        res.status(200).json({others});
    }catch(err){
        res.status(500).json(err)
    }
}

const getAllUsers = async (req, res) => {
  const query = req.query.new;

  try {
    const users = query
      ? await Users.find().sort({ _id: -1 }).limit(5) // Find latest 5
      : await Users.find();

    res.status(200).json({ users });
  } catch (err) {
    console.error("Error : /n" + err); // Log the full error for debugging

    // Send a more generic error message to the client
    res.status(500).json({ message: "An error occurred fetching users" });
  }
};


const getUserStats = async (req, res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await Users.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project: {
                    month: { $month: "$createdAt"},
                },
            },
            {
                $group: {
                    _id: "$month" ,
                    total: {$sum:1},
                }
            }
        ])
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    updateUser,
    deleteUser,
    findUserById,
    getAllUsers,
    getUserStats
};
