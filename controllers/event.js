require('dotenv').config();
var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();
var isLoggedIn = require('../middleware/isLoggedIn');
var yelp = require('yelp-fusion');
var client = yelp.client(process.env.API_KEY);

// yelp search
function yelpSearch(searchTerm, location, callback){
  client.search({
    term: searchTerm,
    location: location
  }).then(response => {
    response.jsonBody.businesses.forEach(function(item){

    });
    callback(response.jsonBody.businesses);
  }).catch(e => {
  });
}

router.get('/schedule', function(req, res) {
  res.render('event/schedule', {businesses: [null]});
});
//yelp post route
router.post('/active', function(req, res) {
  yelpSearch(req.body.course, 'Seattle', function(businesses){
    res.render('event/active', {businesses: businesses});
  });
});
router.get('/schedule', isLoggedIn, function(req, res) {
  res.render('event/confirmed');
});
//post schedule after setup
router.post('/schedule', isLoggedIn, function(req, res){
  // res.send('working');
  // console.log(req.body);
  db.schedule.create({
    course: req.body.course,
    date: req.body.date,
    time: req.body.time,
    userId: req.user.id
  }).then(function(createdSchedule){
    req.flash('success', 'Tee Time Scheduled!');
    res.redirect('/profile');
  }).catch(function(err){
    res.send (err.message)
  });
});

//delete id route in profile
router.delete('/:id', function(req, res) {
  db.schedule.findOne({
    where: {id: req.params.id}
  }).then(function(schedule){
    db.schedule.destroy({
      where:{
        id: req.params.id}
      }).then(function(deleted) {
        res.send('all good');
      }).catch(function(err) {
        res.send('failed', err);
      });
    });
  });

module.exports = router;
