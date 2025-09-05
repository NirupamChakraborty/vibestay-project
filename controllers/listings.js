const Listing = require("../models/listing.js");
const key = process.env.MAP_TOKEN;

module.exports.index = async (req,res)=>{
    
    const allListings= await Listing.find({});

    res.render("listings/index.ejs", {allListings});
     }


module.exports.category = async (req, res) => {
        const { category } = req.params;
        const allListings = await Listing.find({ category });
        res.render("listings/index.ejs", { allListings , selectedCategory: category});
      };
      
module.exports.search = async (req, res) => {
        const searchQuery = req.query.q;
        const allListings = await Listing.find({
          $or: [
            { title: { $regex: searchQuery, $options: "i" } }, // 'i' makes it case-insensitive
            { country: { $regex: searchQuery, $options: "i" } },
            { location: { $regex: searchQuery, $options: "i" } },
            { category: { $regex: searchQuery, $options: "i" } },
            { description: { $regex: searchQuery, $options: "i" } },
          ],
        });
      
        res.render("listings/index.ejs", { allListings });
      };
      

module.exports.renderNewForm =(req,res)=>{
    console.log(req.user)
     res.render("listings/new.ejs");
 
      }     

      

module.exports.createListing = async (req,res,next)=>{


 
  const query =  req.body.listing.location;

      const response = await fetch(`https://api.maptiler.com/geocoding/${query}.json?key=${key}`)
      const data = await response.json();

      const coords = data.features[0].geometry.coordinates;
      
    


    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..." , filename);
    
    const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id

     newListing.image = {url, filename}

     newListing.geometry = {
        type: "Point",
        coordinates: coords,
      };
     
    let savedListing =  await newListing.save();
     console.log(savedListing);
     req.flash("success", "New listing created")
     res.redirect("/listings")
 
     
 }

module.exports.renderEditForm= async (req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    if(!listing){
       req.flash("error", "Listing does not exist");
       res.redirect("/listings")
    }
    // to avoid rendering high quality images for preview
    let originalImageUrl = listing.image.url;
    originalImageUrl =  originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", {listing, originalImageUrl})
}




module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
   
   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing})

   if (typeof req.file != "undefined") {
   let url = req.file.path;
   let filename = req.file.filename;
   listing.image = {url, filename}
   await listing.save();

   }
   let url = req.file.path;
   let filename = req.file.filename;
   listing.image = {url, filename}
   await listing.save();

   req.flash("success", "Listing Updated")
   res.redirect(`/listings/${id}`)

}



module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings")
}





module.exports.showListing=  async (req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate({path : "reviews", populate : {path : "author" }}).populate("owner");
    if(!listing){
       req.flash("error", "Listing does not exist");
       res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing})
     }