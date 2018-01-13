var express = require("express");
var Comment = require("./models/Comment");
var Campground = require("./models/Campground");

var app = express();

function seedDb(){
    removeAllCampgrounds();
    createCampgrounds();
}

function removeAllCampgrounds(){
    Campground.remove(function(err){
        if(err){
            console.log("Failed to delete all comments");
        } else{
            console.log("Removed all comments successfully");
        }
    });
}

function createCampgrounds(){
    var data = 
    [
        {
            name: "Camp 1", 
            photo: "https://farm7.staticflickr.com/6089/6094103869_d53a990c83.jpg", 
            desc: "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e viveu "
            
        },
        {
            name: "Camp 2", 
            photo: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg", 
            desc: "Lorem Ipsum é Desc 2 simplesmente uma simulação de texto da indústria tipográfica e de impressos, e viveu "
            
        },
        {
            name: "Camp 3", 
            photo: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg", 
            desc: "Lorem Ipsum  Desc 3 "
            
        }
    ];
    data.forEach(function(camp){
        Campground.create(camp, function(err, createdCamp){
            if(err){
                console.log("Failed to create Campgrounds");
            } else{
                Comment.create(
                    {author: "Roni", body: "Corpo do comentário "},
                    function(err, createdComment){
                       if(err){
                           console.log("Error creating comment");
                       } else{
                           createdCamp.comments.push(createdComment);
                           createdCamp.save();
                           console.log("Created comment successfully");
                       }
                    });
                console.log("Created Campgrounds successfully");
            }
        }); 
    });
}

module.exports = seedDb;