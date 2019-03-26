var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
// flashMessage
var flash = require('connect-flash');
var favicon = require('serve-favicon');
// session
var session = require('express-session');
var passport = require('passport');
// mongodb
var mongoose   = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');
var passportConfig = require('./lib/passport-config');

var app = express();

// flash Message
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// for connect with mongo DB
mongoose.Promise = global.Promise;
const connStr = "mongodb://admin:1q2w3e4r!@ds119606.mlab.com:19606/mjmong";
mongoose.connect(connStr, { useNewUrlParser: true });
mongoose.connection.on('error', console.log);

// session
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-long--long-secret-12341234jowoojun'
}));

// passport
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// use variable in router
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// set favicon 
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);
require('./routes/auth')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
