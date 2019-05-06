const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const userRouter = require('./routers/user');

//set-up env
dotenv.config();

// database
mongoose.connect(process.env.MONGODB_URL, 
    {
        useNewUrlParser: true,
        useCreateIndex: true
    },
    function(err){
        if(err) throw err;
        console.log(`Server is connecting Database`);
    }
);

// run app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));


app.use('/api/users', userRouter);

app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log(`Server is running on PORT=${PORT}`);
});