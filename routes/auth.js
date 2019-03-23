
module.exports = (app, passport) => {
  app.get('/signin', (req, res, next) => {
    res.render('user/signin');
  });

  app.post('/auth/signin', passport.authenticate('local-signin', {
    successRedirect : '/',
    failureRedirect : '/',
    failureFlash : true
  }));

  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope : 'email' })
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect : '/signin',
      failureFlash : true
    }), (req, res, next) => {
      req.flash('success', 'Welcome!');
      res.redirect('/');
    }
  );

  app.get('/auth/kakaotalk',
    passport.authenticate('kakao-login')
  );

  app.get('/auth/kakaotalk/callback',
    passport.authenticate('kakao-login', {
      failureRedirect: '/',
      failureFlash: true
    }), (req, res, next) =>{
      req.flash('success', 'Welcome!');
      res.redirect('/events');
    }
  );

  app.get('/signout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully signed out');
    res.redirect('/');
  });
};