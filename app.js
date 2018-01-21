var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    sanitazer       = require("express-sanitizer"),
    methodOverride  = require("method-override"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    moment          = require("moment"),
    flash           = require("connect-flash"),
    User            = require("./models/User"),
    Campground      = require("./models/Campground"),
    Comment         = require("./models/Comment"),
    seedDB          = require("./seedDB");
    
//Routes 
var commentRoutes   = require("./routes/comment"),
    campgroundRoutes= require("./routes/campground"),
    authRoutes      = require("./routes/authentication");
    
//seedDB();
console.log("Using Database set in the environment variable DATABASE_URL: ", process.env.DATABASE_URL);
var databaseUrl = process.env.DATABASE_URL || "mongodb://localhost/yelp_camp"
mongoose.connect(databaseUrl, function(err){
    if (err){
        throw err;
    } else{
        console.log('Mongo DB is connected');
    }
});
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});


app.set("view engine", "ejs");
app.locals.moment = require('moment');
app.use(flash());
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
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
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
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is listening"); 
});

