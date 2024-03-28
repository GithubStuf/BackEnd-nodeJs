const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');

const User = require('../models/Users');

const addUser =  async (req, res) => {
    try {
        const {
            username,
            email,
            password
        } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = new User({
            username: username,
            email:email,
            password: hashedPassword,
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const authUser = async (req, res) => {
    try {
        const {email, password } =req.body;
              const user = await User.findOne({ email });
              if (!user) {
                res.status(500).json('User not found')
              }
              bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    // password is valid
                    User.find().exec()
                    .then((users) => {
                        res.status(201).json('Login Succesful')
                    })
                    .catch((err) => {
                        res.status(500).json(err)
                    });
                }else{
                    res.status(404).json('Password Incorrect')
                }
            });

            const token = jwt.sign({ 
                userId: user._id ,
                isAdmin: user.isAdmin,
            }, process.env.SECRET_KEY, {
                expiresIn: '3d'
            });

            const {...others } = user._doc; 
            res.status(200).json({...others, token});

            } catch (error) {
                res.status(500).json(error)
            }
};

module.exports = {
    addUser, 
    authUser,
};
