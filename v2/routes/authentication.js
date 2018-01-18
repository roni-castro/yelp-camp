var express         = require("express"),
    passport        = require("passport"),
    User            = require("../models/User"),
    router          = express.Router();

// Show login page
router.get("/login", function(req, res){
   res.render("authentication/login"); 
});

// Show registration page
router.get("/signup", function(req, res){
   res.render("authentication/signup"); 
});

// Logout user
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

// Register user and logs him in
router.post("/signup", function(req, res){
   console.log(req.body);
   var newUser = new User({username: req.body.username, name: req.body.name});
   User.register(new User(newUser), req.body.password, function(err, createdUser){
       if(err){
           console.log(err);
           res.render("authentication/signup");
       } else{
           console.log(createdUser);
           passport.authenticate("local")(req, res, function(){
               res.redirect("/")
           });
       }
   })
});

// Logs the use
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});
    
    
module.exports = router;
