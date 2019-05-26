const express = require('express');
const router = express.Router();
const catchErrors = require('../lib/async-error');
const Event = require('../models/Event');
const Comment = require('../models/Comment')

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/');
  }
}

function validateForm(form) {
  const title = form.title || "";
  const event_description = form.event_description || "";
  const price = form.price || "";
  const university = form.university || "";
  const event_type = form.event_type || "";
  const event_topic = form.event_topic || "";
  

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
  const limit = parseInt(req.query.limit) || 2;

  const query = {};
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
  console.log(events)
  res.render('board/index', {events: events, term: term, query: req.query});
}));

router.get('/:id', catchErrors(async (req, res, next) => {
  const eventID = req.params.id;
  const event = await Event.findById(eventID).populate('author');
  const comments = await Comment.find({
    event: eventID
  }).populate('author');
  console.log('comments', comments)
  res.render('board/event-page', { event, comments });
}));

router.get('/new', needAuth, catchErrors(async(req, res, next) => {
  res.render('board/new', {events: {}});
}));

router.post('/comment', needAuth, catchErrors(async (req, res, next) => {
  const eventID = req.body.eventID;
  const user = req.user;

  if (!req.body.content) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  const comment = new Comment({
    event: eventID,
    author: user._id,
    content: req.body.content,
  })
  await comment.save();

  req.flash('success', 'Successfully commented');
  res.redirect('/board/' + eventID);
}));

router.post('/', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const err = validateForm(req.body);

  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  const event = new Event({
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