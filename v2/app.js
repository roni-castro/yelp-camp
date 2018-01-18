var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    sanitazer       = require("express-sanitizer"),
    methodOverride  = require("method-override"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    moment          = require('moment'),
    User            = require("./models/User"),
    Campground      = require("./models/Campground"),
    Comment         = require("./models/Comment"),
    seedDB          = require("./seedDB");
    
//seedDB();
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true}, function(err){
    if (err){
        throw err;
    } else{
        console.log('Mongo DB is connected');
    }
});

app.set("view engine", "ejs");
app.locals.moment = require('moment');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(sanitazer());

//Configure Authentication - Passport
app.use(require("express-session")({
    secret: "Yelp camp secret phrase",
    resave: false,
    saveUninitialized: false
}));
// Init passport authentication 
app.use(passport.initialize());
// persistent login sessions 
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));
// save logged user to be used on some views
app.use(function(req, res, next){ 
    res.locals.currentUser = req.user;
    next();
})


app.get("/", function(req, res){
   res.redirect("/campgrounds"); 
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, 
    function(err, camps){
        if(err){
            console.log(err);
        } else {
            console.log(camps);
            res.render("campground/campgrounds", {camps: camps});
        }
    });   
});

app.get("/campgrounds/newCampground", function(req, res) {
     res.render("campground/newCampground"); 
});

app.get("/campgrounds/:id/editCampground", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp){
       if(err){
           console.log(err);
       } else{
           res.render("campground/editCampground", {camp: foundCamp});
       }
    });
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments")
    .exec(
        function(err, foundCamp){
            if(err){
                console.log(err);
            } else {
                console.log(foundCamp);
                res.render("campground/campgroundDetail", {camp: foundCamp});
            }
        }
    );   
});

app.get("/campgrounds/:id/comments/newComment", isLoggedIn, function(req, res){
    Campground.findById(req.params.id,
        function(err, foundCamp){
            if(err){
                console.log(err);
            } else {
                console.log(foundCamp);
                res.render("comment/newComment", {camp: foundCamp});
            }
        }
    );   
});

app.get("/login", function(req, res){
   res.render("authentication/login"); 
});

app.get("/signup", function(req, res){
   res.render("authentication/signup"); 
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

app.post("/signup", function(req, res){
   console.log(req.body);
   var newUser = new User({username: req.body.username, name: req.body.name});
   User.register(new User(newUser), req.body.password, function(err, createdUser){
       if(err){
           console.log(err);
       } else{
           console.log(createdUser);
           passport.authenticate("local")(req, res, function(){
               res.redirect("/")
           });
       }
   })
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

app.post("/campgrounds", function(req, res){
    req.body.post.desc = req.sanitize(req.body.post.desc);
    Campground.create(req.body.post, 
    function(err, camp){
        if(err){
            console.log(err);
        } else {
            console.log(camp);
        }
    });
   res.redirect("/campgrounds");
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    var reqCommentObj = req.body.comment;
    var reqCommentParams = req.params;
    reqCommentObj.body = req.sanitize(reqCommentObj.body);
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            Comment.create(reqCommentObj, function(err, createdComment){
                if(err){
                    console.log(err);
                } else{
                    foundCamp.comments.push(createdComment);
                    foundCamp.save();
                    res.redirect("/campgrounds/" + reqCommentParams.id);
                }
            });
        }
    });
});

app.put("/campgrounds/:id", function(req, res){
    req.body.post.desc = req.sanitize(req.body.post.desc);
    Campground.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
       if(err){
           console.log(err);
       } else{
            res.redirect("/campgrounds/" + req.params.id);          
       }
    });
});

app.delete("/:id", function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
            console.log(err);
       } else{
            res.redirect("/campgrounds");          
       }
    });
});

app.get("*", function(req, res){
    res.send("Route not defined");
})

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is listening"); 
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}