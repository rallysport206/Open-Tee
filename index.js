require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
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
  // res.send('homepage coming soon!')
  res.render('home');
});
app.get('/profile', isLoggedIn, function(req,res) {
  res.render('profile');
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
// app.get('/', function(req, res) {
//   var qs = {
//     s: 'Seattle Courses',
//     apikey: process.env.API_KEY
//   };
//   request({
//     url: 'https://api.yelp.com/v3/businesses/golf-courses-seattle',
//     qs: qs
//   }, function(error, response, body){
//     if (!error && response.statusCode == 200){
//       var dataObj = JSON.parse(body);
//       res.send(dataObj.Search);
//     }
//   });
// });
app.use('/auth', require('./controllers/auth'));
app.use('/event', require('./controllers/event'));
// app.use('/schedule', require('./controllers/schedule'));
//listen
app.listen(process.env.PORT || 3050);
