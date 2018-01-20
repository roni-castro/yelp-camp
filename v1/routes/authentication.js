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
    req.flash("success", "Logged out successfully");
    res.redirect("/");
});

// Register user and logs him in
router.post("/signup", function(req, res){
   console.log(req.body);
   var newUser = new User({username: req.body.username, name: req.body.name});
   User.register(new User(newUser), req.body.password, function(err, createdUser){
       if(err || !createdUser){
           req.flash("error", err.message);
           res.redirect("back");
       } else{
            req.flash("success", "User was created successfully");
            passport.authenticate("local")(req, res, function(){
                res.redirect("/")
            });
       }
   })
});

// Logs in the user
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {  
        req.flash("error", err.message); 
        return next(err); 
    }
    if (!user) {
        req.flash("error", "User or password is incorrect");
        return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) {
          req.flash("error", err.message);
          return next(err); 
      }
      return res.redirect('/');
    });
  })(req, res, next);
});
    
    
module.exports = router;
