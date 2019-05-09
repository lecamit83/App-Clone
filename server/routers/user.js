const express = require('express');
const router = express.Router();

const User = require('../models/User');

const validateRegisterInput = require('../validation/register')

router.post('/register', async (req, res) => {

    const { isValid, errors } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(404).json(errors);
    }
  
    
    try {
      
        let existUser = await User.findOne({ email: req.body.email });

        if( existUser ){
            errors.email = 'Email was used!';
            return res.status(404).json(errors);
        }
        
        let user = new User(req.body);

        await user.save();
        const token = await user.generateAuthenticationToken();
      
        res.status(201).json({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;