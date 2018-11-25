var express = require('express');
var router = express.Router();
var passport = require('passport');
var fs = require('fs');
var LocalStrategy = require('passport-local').Strategy;

// Database
var User = require('../models/user');
var Blog = require('../models/article');

// Routes
// Login Page
router.get('/dashboard', ensureAuthenticated, function(req, res){
  res.render('dashboard');
});

// Aricle page
router.get('/articles', function(req, res) {
  Blog.find({}, function(err, article) {
    if(err) {
      console.log(err);
    } else {
      res.render('articles', {
        article: article
      });
    }
  });
});

// Images upload route
router.get('/article/add', ensureAuthenticated, function(req, res) {
  Blog.find({}, function(err, article) {
    res.render('add_article', {
      article: article
    });
  });
});

// Edit and delete articles
router.get('/article/edit:id', function(req, res) {
  Blog.findById(req.params.id, function(err, article) {
    if(err){
      console.log(err);
    } else {
    res.render('edit_article', {
      article: article
      });
    }
  });
});

router.post('/article/edit:id', function(req, res) {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id};

  Blog.update(query, article, function(err) {
    if(err) {
      console.log(err);
      return;
    } else {
      res.redirect('/users/articles');
    }
  });
});

// Delete Article
router.delete('/edit_article:id', function(req, res) {
  let query = {_id:req.params.id};

  Blog.remove(query, function(err){
       if(err){
         console.log(err);
       }
      res.send('Success');
  });
});

// Login Page
router.get('/admin', function(req, res){
  res.render('admin');
});

// Admin users
router.get('/administrators', ensuredAuthenticated, function(req, res) {
  User.find({}, function(err, users) {
    if(err) {
      console.log(err);
    } else {
      res.render('administrators', {
        users: users
      });
    }
  });
});

// Individual user accounts
router.get('/admin_user:id', ensuredAuthenticated, function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      res.render('admin_user', {
        user: user
      });
    }
  });
});

// Delete Users
router.delete('/admin_user:id', function(req, res) {
  let query = {_id:req.params.id};

   User.remove(query, function(err){
       if(err){
           console.log(err);
       }
      res.send('Success');
  });
});

//Registration page
router.get('/register', ensuredAuthenticated, function(req, res){
  res.render('register');
});

// Register User
router.post('/register', function(req, res){
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length >= 1) {
        req.flash('error_msg', 'Email already exists.');

        res.redirect('/users/register');
      } else {
          let name = req.body.name;
          let email = req.body.email;
          let username = req.body.username;
          let password = req.body.password;
          let password2 = req.body.password2;
          let adminCode = req.body.adminCode;

          // Validating input on registration page
          req.checkBody('name', 'Name is required').notEmpty();
          req.checkBody('email', 'Email is required').notEmpty();
          req.checkBody('email', 'Email is not valid').isEmail();
          req.checkBody('username', 'Username is required').notEmpty();
          req.checkBody('password', 'Password is required').notEmpty();
          req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        // Error validation
          var errors = req.validationErrors();

          if (errors) {
            res.render('register',{
              errors:errors
            });
          } else {
            var newUser = new User({
              name: name,
              email: email,
              username: username,
              password: password
            });

            // Set administrative right to new user
            if(adminCode === 'secretcode123') {
            newUser.isAdmin = true;
            }

            // committing validated info to database
            User.createUser(newUser, function(err, user){
              if(err) throw err;
              console.log(user);
            });

            req.flash('success_msg', 'A new user has been created and may login.');

            res.redirect('/users/admin');
          }
              }
            })

});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Unknown User'});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/admin',
  passport.authenticate('local', {successRedirect: '/users/dashboard', failureRedirect: '/users/admin', failureFlash: true }),
  function(req, res) {
    res.redirect('/users/dashboard');
  });

router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/admin');
});

function ensuredAuthenticated(req, res,next){
    if(req.isAuthenticated() && req.user.isAdmin === true){
        return next();
    } else {
        //req.flash('error_msg', 'You are not logged in');
        req.flash('error_msg', 'You are not authorized to access that page');
        res.redirect('/users/dashboard');
    }
}

function ensureAuthenticated(req, res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg', 'You are not logged in');
        res.redirect('/');
    }
}

module.exports = router;
