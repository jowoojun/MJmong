var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const Event = require('../models/Event');

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/');
  }
}

function validateForm(form) {
  var title = form.title || "";
  var event_description = form.event_description || "";
  var price = form.price || "";
  var university = form.university || "";
  var event_type = form.event_type || "";
  var event_topic = form.event_topic || "";
  

  title = title.trim();
  event_description = event_description.trim();

  event_type = event_type.trim();
  event_topic = event_topic.trim();

  if (!title) {
    return 'Title is required.';
  }
  if (!event_description) {
    return 'Event description is required.';
  }
  if (!university){
    return 'University is required.';
  }
  if (!price){
    return 'Price is required.';
  }
  if (!event_type) {
    return 'Event type is required.';
  }
  if (!event_topic) {
    return 'Event description is required.';
  }
  return null;
}

/* GET home page. */
router.get('/',  catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {event_field: {'$regex': term, '$options': 'i'}}
    ]};
  }

  const events = await Event.paginate(query, {
    sort: {createdAt: -1}, 
    populate: 'author', 
    page: page, limit: limit
  });

  res.render('board/index', {events: events, term: term, query: req.query});
}));

router.get('/new', needAuth, catchErrors(async(req, res, next) => {
  res.render('board/new', {events: {}});
}));

router.post('/', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const err = validateForm(req.body);

  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  var event = new Event({
    title: req.body.title,
    author: user._id,
    event_description: req.body.event_description,
    price: req.body.price,
    university: req.body.university,
    event_type: req.body.event_type,
    event_topic: req.body.event_topic,
    rating: 0.0,
  });
  await event.save();

  req.flash('success', 'Successfully posted');
  res.redirect('/board');
}));

module.exports = router;