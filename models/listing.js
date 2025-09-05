const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description:{
        type:String,
    }, 
    
    image: {
        url: String,
        filename: String,
    },
    

    price: Number,
    location: String,
    country: String,
    reviews:[ //array of reviews
        {
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
],
owner:{
    type: Schema.Types.ObjectId,
    ref:"User",
},
geometry:  {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category: {
    type: String,
    enum: [
        "trending",
        "rooms",
        "cities",
        "hill-station",
        "castles",
        "pool-area",
        "camping",
        "farms",
        "arctic",
        "domes",
        "house-boat"
    ],
    required: true
}
});


// DELETE POST MIDDLEWARE OF MONGOOSE TO DELETE REVIEW WHEN lISTING IS DELETED
listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})








const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;