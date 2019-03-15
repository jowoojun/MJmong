var express = require('express');
var router = express.Router();

var countries = ["명지대학교 서울캠퍼스", "명지대학교 용인캠퍼스", "단국대학교 분당캠퍼스", "명지고등학교", "명지중학교", "명지초등학교", "명지전문대학교"];


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/search', function(req, res, next) {
  res.render('test');
});

// 검색
router.get('/suggest', function(req, res, next) {
  let q = req.query.q ? req.query.q.toLowerCase() : '';

  if (!q) {
    return res.json([]);
  }

  // q의 내용이 name에 포함된 이름만 모아서 배열로 반환
  // JSON으로 결과를 return
  res.json(countries.filter(name => {
    // name, query 모두 소문자로 변경하여 대소문자 구별 없이 포함하고 있는지 비교
    return name.toLowerCase().indexOf(q) > -1;
  }));
});

module.exports = router;
