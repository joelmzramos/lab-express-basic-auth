const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const router  = express.Router();
const saltRounds = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res) => {
  res.render('signup');
})

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if(username === '' || password === '') {
    res.render('signup', { errorMessage: 'Usuário ou Senha não preenchidos!' });
    return;
  }

  const user = await User.findOne({ username });
  if(user) {
    res.render('signup', { errorMessage: 'Usuário já cadastrado!' });  
    return;  
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User({ username, password: hash });
  try {    
    await newUser.save();
    // res.redirect('/')
  } catch (error) {
    console.log(error);
  }


});

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if(username === '' || password === '') {
    res.render('login', { errorMessage: 'Usuário ou Senha não preenchidos!' });
    return;
  }

  const user = await User.findOne({ username });
  if(!user) {
    res.render('login', { errorMessage: 'Usuário não cadastrado!' });  
    return;  
  }
  if(bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user;
    console.log('logei');
    // res.redirect('')
  } else {
    res.render('login', { errorMessage: 'Usuário ou senha inválidos!' });  
    return; 
  }


});

module.exports = router;
