const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
//const prefixe = '/api/auth';

router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);


/*router.post(prefixe + '/signup',(req, res) => {
    console.log("email", req.body.email);
    userCtrl.signup(req, res);
});

router.post(prefixe +'/login',(req, res) => {
    console.log("email", req.body.email);
    userCtrl.login(req, res);
});*/

module.exports = router;