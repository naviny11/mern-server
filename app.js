const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const cookieParser = require('cookie-Parser');
app.use(cookieParser());

dotenv.config({path: './config.env'});

require('./db/conn');
//const User = require('./model/userSchema');

app.use(express.json());

//we link the router file to make our route easy
app.use(require('./router/auth'));

const PORT = process.env.PORT;

//middleware
const middleware = (req, res, next) => {
    console.log('This is the middleware function..')
    next();
}
//middleware();

/* app.get('/', (req, res) => {
    res.send('Hello world from the server app js file..!!')
}); */

/* app.get('/about', (req, res) => {
    console.log('This is about page')
    res.send('Hello world from the about page ..!!')
});
 */
app.get('/contact', (req, res) => {
    res.send('Hello world from the contact page ..!!')
});

app.get('/signin', (req, res) => {
    res.send('Hello world from the sign in page ..!!')
});

app.get('/signup', (req, res) => {
    res.send('Hello world from the sign up page ..!!')
});

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
})