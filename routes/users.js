const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const catchErrors = require('../lib/async-error');

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/');
  }
}

function validateForm(form, options) {
  const name = form.name || "";
  const email = form.email || "";
  name = name.trim();
  email = email.trim();

  if (!name) {
    return 'Name is required.';
  }

  if (!email) {
    return 'Email is required.';
  }

  if (!form.password && options.needPassword) {
    return 'Password is required.';
  }

  if (form.password !== form.password_confirmation) {
    return 'Passsword do not match.';
  }

  if (form.password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return null;
}

router.get('/:id', needAuth, catchErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const events = await Event.find({
    author: req.params.id
  });

  res.render('users/index', { user, events });
}));

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.render('users/edit', {user: user});
}));

// router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
//   const user = await User.findOneAndRemove({_id: req.params.id});
//   req.flash('success', 'Deleted Successfully.');
//   res.redirect('/');
// }));

router.post('/signup', catchErrors(async (req, res, next) => {
  const err = validateForm(req.body, {needPassword: true});
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  const user = await User.findOne({email: req.body.email});
  
  if (user) {
    req.flash('danger', 'Email address already exists.');
    return res.redirect('back');
  }
  user = new User({
    name: req.body.name,
    email: req.body.email,
  });
  user.password = await user.generateHash(req.body.password);
  await user.save();
  req.flash('success', 'Registered successfully. Please sign in.');
  res.redirect('/');
}));

router.put('/changeInfo', catchErrors(async (req, res, next) => {
  if (!req.body.password) {
    req.flash('danger', '정보 변경시 기존 password 입력이 필요합니다.');
    return res.redirect('back');
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('danger', 'Not exist user.');
    return res.redirect('back');
  }

  if (!await user.validatePassword(req.body.password)) {
    req.flash('danger', 'Current password invalid.');
    return res.redirect('back');
  }

  if (user.name !== req.body.newName) {
    user.name = req.body.newName;
  }

  if (user.email !== req.body.newEmail) {
    user.email = req.body.newEmail;
  }

  if (req.body.newPassword.length > 0) {
    if (req.body.newPassword.legnth < 6){
      req.flash('danger', 'Password must be at least 6 characters.');
      return res.redirect('back');
    }
    user.password = await user.generateHash(req.body.newPassword);
  }

  await user.save((err) => {
    if (err) { return next(err) }
  });
  req.flash('success', 'Updated successfully.');
  req.logout();
  res.redirect('/');
}));

// router.get('/:id/changePassword', catchErrors(async(req, res, next) => {
//   const user = await User.findById(req.params.id);
//   res.render('users/change_password', {user: user});
// }));

// router.put('/:id/changePassword', needAuth, catchErrors(async (req, res, next) => {
//   const user = await User.findById({_id: req.params.id});
  
//   if(!req.body.new_password) {
//     req.flash('danger', 'Password is requried.');
//     return res.redirect('back');
//   }
//   if(req.body.new_password !== req.body.new_password_confirmation){
//     req.flash('danger', 'Password do not match.');
//     return res.redirect('back');
//   }
//   if(req.body.password.legnth < 6){
//     req.flash('danger', 'Password must be at least 6 characters.');
//     return res.redirect('back');
//   }

//   user.password = await user.generateHash(req.body.new_password);
//   await user.save(function(err){
//     if(err) {next(err)}
//     else {
//       req.flash('success', 'Updated successfully.');
//       res.redirect(`/users/${req.params.id}`);
//     }
//   })
// }));

module.exports = router;