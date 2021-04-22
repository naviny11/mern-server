const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

require('../db/conn');
const User = require('../model/userSchema');

router.get('/', (req, res) => {
    res.send('Hello world from the server router js file ..!!')
});

//register process
//using promises
/* router.post('/register', (req, res) => {
    const {name, email, phone, work, password, cpassword} = req.body;
    console.log(name);
    console.log(email);
    if( !name || !email || !phone || !work ||!password || !cpassword ) {
        return res.status(422).json({error: "All fields are mandatory!!"});
    }

    User.findOne({email: email})
    .then((userexists) => {
        if(userexists){
            return res.status(422).json({error: "Email already exists!!"});
        }

        const user = new User({name, email, phone, work, password, cpassword})
        user.save().then(() => {
            return res.status(201).json({message: "User registered successfully!!"});
        }).catch((err) => res.status(500).json({error:"Failed to register"}))

    }).catch((err) => {console.log(err)});
}) */

//using async await
router.post('/register', async (req, res) => {

    const {name, email, phone, work, password, cpassword} = req.body;

    if( !name || !email || !phone || !work ||!password || !cpassword ) {
        return res.status(422).json({error: "All fields are mandatory!!"});
    }

    try {
        const userExists = await User.findOne({email: email});
        if(userExists) {
            return res.status(422).json({error: "Email already exists!!"});
        } else if(password != cpassword ){
            return res.status(422).json({error: "Passwords do not match!!"});
        } else {
            const user = new User({name, email, phone, work, password, cpassword})

            let userregstatus = await user.save();

            if(userregstatus) {
                return res.status(201).json({message: "User registered successfully!!"});
            }
        }

        
    } catch(err){
        console.log(err);
    }
    
})


//login process
router.post('/login', async (req, res) => {
    //console.log(req.body);
    //res.json({message:"Login successfull"});

    try{
        const {email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({error:"All fields are mandatory"});
        }

        const userLogin = await User.findOne({email:email});

        if(userLogin){

            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();

            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if(!isMatch) {
                //console.log(userLogin);
                return res.status(400).json({error: "Invalid credentials - password"});
            } else {
                //console.log(userLogin);
                return res.status(200).json({message: "User login successfull"});
            }
        } else {
            return res.status(400).json({error: "Invalid credentials - email"});
        }
    } catch(err) {
        console.log(err);
    }
})

//about us page
router.get('/about', authenticate, (req, res) => {
    //console.log('This is about page')
    res.send(req.rootUser);
});


//about us page
router.get('/logout', (req, res) => {
    console.log('This is logout page');
    res.clearCookie('jwtoken', {path: '/'});
    res.status(200).send('User logout');
});

module.exports = router;