//Imports
require('dotenv').config();
const express = require('express');
var cors = require('cors')
const mongoose = require('mongoose');



const app = express();
const PORT = process.env.PORT || 8080;

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.DB_URI,{
    });
      console.log(`Server started at http://localhost:${PORT}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

const options = {
  origin: "http://localhost:5173/",
};

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(options));


//Routes
app.use("/api/auth", require('./routes/AuthRoute'));
app.use("/api/users", require('./routes/RouteUser'));
app.use("/api/products", require('./routes/ProductRoute'));
app.use("/api/carts", require('./routes/CartRoute'));
app.use("/api/orders", require('./routes/OrderRoute'));
app.use("/api/checkout", require('./routes/StripeRoute'));


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})
