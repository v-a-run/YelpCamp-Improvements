var mongoose = require("mongoose");

// SCHEMA SETUP //
	var campgroundSchema = new mongoose.Schema({
		name  : String,
		price : Number,
		image : String,
		description : String,
		author : {
		id : {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username : String
	},
		comments : [
			{
				type: mongoose.Schema.Types.ObjectId,
        		ref: "Comment"
			}
		]
	});

// Pre hook for deleting commments as well //
const Comment = require('./comment');
campgroundSchema.pre("remove",async function(){
   await Comment.deleteMany({
      _id:{
         $in:this.comments
      }
   });
}); 

	module.exports = mongoose.model("Campground", campgroundSchema);