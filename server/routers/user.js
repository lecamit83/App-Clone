const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.route('/')
.get((req, res) => {
  res.json({isOkey : 'Okey!'})
});

router.route('/register')
.post(async function(req, res){

    let user = new User(req.body);
   
    try {
        await user.save();
        //const token = await user.generateAuthenticationToken();
   
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});
module.exports = router;