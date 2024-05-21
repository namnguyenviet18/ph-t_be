
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const photoRouter = require('./routes/photo');
require('dotenv').config();
const port = process.env.PORT || 8080;
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("Photo sharing database connected");
    })
    .catch((err) => { console.log(err); });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/admin', userRouter);
app.use('/photos', photoRouter);
app.listen(port, "localhost", () => console.log(`Server are runing on port: ${port}`));