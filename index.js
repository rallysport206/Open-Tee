require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
var db = require('./models');
var ejsLayouts = require('express-ejs-layouts');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var passport = require('./config/passportConfig');
var session = require('express-session');
var request = require ('request');
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public/'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

app.get('/', function(req,res) {
  res.render('home');
});

//schedule displays on profile
app.get('/profile', isLoggedIn, function(req,res) {
///do database call and put res.render in a then promise pass in result of database call into object
  db.schedule.findAll({
    where: {userId:res.locals.currentUser.dataValues.id}
  }).then(function(schedule) {
    res.render('profile', {schedule: schedule});
  }).catch(function(err){
    res.send(404, err)
  });
});

app.get('/schedule', isLoggedIn, function(req,res) {
  res.render('event/schedule');
});
app.get('/active', isLoggedIn, function(req, res) {
  res.render('event/active');
});
app.get('/confirmed', isLoggedIn, function(req, res) {
  res.render('event/confirmed');
});
app.get('/search', isLoggedIn, function(req, res) {
  res.render('event/search');
});
app.use('/auth', require('./controllers/auth'));
app.use('/event', require('./controllers/event'));
app.listen(process.env.PORT || 3050);
