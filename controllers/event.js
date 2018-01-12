require('dotenv').config();
var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();
var isLoggedIn = require('../middleware/isLoggedIn');
var yelp = require('yelp-fusion');
var client = yelp.client(process.env.API_KEY);

function yelpSearch(searchTerm, location, callback){
  client.search({
    term: searchTerm,
    location: location
  }).then(response => {
    response.jsonBody.businesses.forEach(function(item){

    });
    callback(response.jsonBody.businesses);
  }).catch(e => {
    console.log(e);
  });
}

router.get('/', function(req, res) {
  console.log();
  res.send('api page');
});

router.get('/schedule', function(req, res) {
  console.log('find rest route reach');
  res.render('event/schedule', {businesses: [null]});
});

router.post('/active', function(req, res) {
  console.log('req.body');
  yelpSearch(req.body.course, 'Seattle, Golf', function(businesses){
    res.render('event/active', {businesses: businesses});
  });
});
router.get('/schedule', isLoggedIn, function(req, res) {
  res.render('event/confirmed');
});

router.post('/schedule', isLoggedIn, function(req, res){
  // res.send('working');
  // console.log(req.body);
  db.schedule.create({
    course: req.body.course,
    date: req.body.date,
    time: req.body.time,
    userId: req.user.id
  }).then(function(createdSchedule){
    res.redirect('/profile');
  }).catch(function(err){
    res.send (err.message)
  });
});

module.exports = router;
