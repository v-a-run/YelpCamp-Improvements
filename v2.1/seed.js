var mongoose = require('mongoose'),
	Campground = require('./models/campground'),
	Comment	= require('./models/comment');

var data = [
	{
		name : "Jojo",
		image : "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
		description : "mvsdojfwi0qwnfwancpancp0aqnvwv"
	},
	{
		name : "Ryuk",
		image : "https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
		description : "sdnofcewnofwdconqw0f-qwfcwq-mv-aqw"
	},
	{
		name : "Yagami",
		image : "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
		description : "ncasoncowbfuqwfuvqwabcaobvaovabpvpawbv"
	}
]

function seedDB(){
	// remove campgrounds //
	Campground.remove({}, function(err){
		// if(err){
		// 	console.log(err)
		// }
		// console.log("removed Campgrounds!");
		// // remove comments //
		// Comment.remove({}, function(err) {
		// if(err){
		// console.log(err);
		// }
		// console.log("removed comments!");
		// 	data.forEach(function(seed){
		// 		Campground.create(seed, function(err, campground){
		// 			if(err){
		// 				console.log(err)
		// 			} else{
		// 				console.log("added Campground !")
		// 				// add comments //
		// 				Comment.create({
		// 					text : "This is a comment.",
		// 					author : "Me"
		// 				}, function(err, comment){
		// 					if(err){
		// 						console.log(err)
		// 					} else{
		// 						campground.comments.push(comment);
		// 						campground.save();
		// 						console.log("added comments..");
		// 					}
		// 				})
		// 			}
		// 		})
		// 	});
		// });
	}
)}

module.exports = seedDB;


