var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const Event = require('../models/event');

/* GET home page. */
router.get('/',  catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {locate: {'$regex': term, '$options': 'i'}},
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


module.exports = router;