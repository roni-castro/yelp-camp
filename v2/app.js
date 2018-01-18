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
    
//Routes 
var commentRoutes   = require("./routes/comment"),
    campgroundRoutes= require("./routes/campground"),
    authRoutes      = require("./routes/authentication");
    
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
app.use(passport.initialize()); // Init passport authentication 
app.use(passport.session()); // persistent login sessions 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));
// save logged user to be used on some views
app.use(function(req, res, next){ 
    res.locals.currentUser = req.user;
    next();
});
app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes); // All routes start with /campgrounds
app.use("/campgrounds/:id/comments", commentRoutes); // All routes start with /campgrounds/:id/comments

app.get("/", function(req, res){
   res.redirect("/campgrounds"); 
});

app.get("*", function(req, res){
    res.send("Route not defined");
})

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is listening"); 
});

