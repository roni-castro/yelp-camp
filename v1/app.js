var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var camps = [
    {name: "Camp 1", photo:"https://media.pitchup.co.uk/images/5/image/private/s--lzu_mhiF--/c_limit,h_1350,w_1800/e_improve,fl_progressive/q_50/b_rgb:000,g_south_west,l_pu_logo_white_vcbkgt,o_25/v1421355078/arosa-caravan-and-camping-park/arosa-caravan-and-camping-park--3.jpg"},    
    {name: "Camp 2", photo:"http://buckdencamping.co.uk/wp-content/uploads/Tents-at-buckden-camping-2017.jpg"},    
    {name: "Camp 3", photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7fvw7VLGXEDfMzkzoNFdHx5jaBa8NtF8GJsLSRzCJQK2gUuK4"},    
    {name: "Camp 777777777777777777777777777777777777777777777777777777777777773", photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7fvw7VLGXEDfMzkzoNFdHx5jaBa8NtF8GJsLSRzCJQK2gUuK4"},
    {name: "Camp 4", photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7fvw7VLGXEDfMzkzoNFdHx5jaBa8NtF8GJsLSRzCJQK2gUuK4"}, 
    {name: "Camp 5", photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7fvw7VLGXEDfMzkzoNFdHx5jaBa8NtF8GJsLSRzCJQK2gUuK4"}, 
    {name: "Camp 6", photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7fvw7VLGXEDfMzkzoNFdHx5jaBa8NtF8GJsLSRzCJQK2gUuK4"}, 
    {name: "Camp 8", photo:"http://www.unusualhotelsoftheworld.com/Images/Hotels/Big/JollydaysLuxuryCamping635073318851975000_big.jpg"}   
    
]

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
   res.redirect("/campgrounds"); 
});

app.get("/campgrounds", function(req, res){
   res.render("campgrounds", {camps: camps}); 
});

app.get("/campgrounds/newCampground", function(req, res) {
     res.render("newCampground"); 
})

app.post("/campgrounds", function(req, res){
   var newCampName = req.body.name; 
   var newCampPhoto = req.body.photo; 
   var newCamp = {name: newCampName, photo: newCampPhoto};
   console.log(newCampName, newCampPhoto);
   camps.push(newCamp);
   res.redirect("/campgrounds");
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is listening"); 
});