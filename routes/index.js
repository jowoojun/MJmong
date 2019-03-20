var express = require('express');
var router = express.Router();

var campus = ["명지대학교 서울캠퍼스", "명지대학교 용인캠퍼스", "단국대학교 분당캠퍼스", "명지고등학교", "명지중학교", "명지초등학교", "명지전문대학교"];
var major = ["컴퓨터공학과", "전자공학과", "문헌정보학과", "데이터테크놀로지학과", "경제학과","경영학과","사회복지학과","기계공학과","전기공학과","수학과","화학과"];
var year = ["2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
var semester = ["1학기", "2학기", "겨울학기", "여름학기"];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/search', function(req, res, next) {
  res.render('test');
});

// 캠퍼스 검색
router.get('/campus_search', function(req, res, next) {
  let q = req.query.q ? req.query.q.toLowerCase() : '';

  if (!q) {
    return res.json([]);
  }

  res.json(campus.filter(name => {
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