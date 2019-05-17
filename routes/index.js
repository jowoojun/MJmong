var express = require('express');
var router = express.Router();
const Event = require('../models/Event');
const catchErrors = require('../lib/async-error');

var university = ["명지대학교 서울캠퍼스", "명지대학교 용인캠퍼스", "단국대학교 분당캠퍼스", "명지고등학교", "명지중학교", "명지초등학교", "명지전문대학교"];
var major = ["컴퓨터공학과", "전자공학과", "문헌정보학과", "데이터테크놀로지학과", "경제학과","경영학과","사회복지학과","기계공학과","전기공학과","수학과","화학과"];

/* GET home page. */
router.get('/', catchErrors(async (req, res, next) => {
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
    limit: limit
  });
  
  res.render('index', {events: events});
}));

router.post('/search', function(req, res, next) {
  res.render('test');
});

// 학교 검색
router.get('/university_search', function(req, res, next) {
  let q = req.query.q ? req.query.q.toLowerCase() : '';

  if (!q) {
    return res.json([]);
  }
  console.log(university)
  res.json(university.filter(name => {
    return name.toLowerCase().indexOf(q) > -1;
  }));
});

// 전공 검색
router.get('/major_search', function(req, res, next) {
  let q = req.query.q ? req.query.q.toLowerCase() : '';

  if (!q) {
    return res.json([]);
  }

  res.json(major.filter(name => {
    return name.toLowerCase().indexOf(q) > -1;
  }));
});

module.exports = router;