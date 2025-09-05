const User = require("../models/user.js");

module.exports.renderSignup = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup = async (req,res)=>{
    try{
        let {username, email, password} = req.body;
    let newUser= new User({email, username});
    const registeredUser = await User.register(newUser, password)
    console.log(registeredUser);
    // automatic login -> docs form passport
    req.login(registeredUser,(err)=>{
            if(err){
            return next(err)
            }
            req.flash("success", "Welcome to VibeStay");
            res.redirect("/listings")            
        })
    
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup")
    }
    
}



module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login =  async(req, res)=>{
    req.flash("success","Welcome to VibeStay! You are logged in!")
  //   to counter home page login
  let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)
  }


module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
        return next(err)
        }
        req.flash("success", "You have logged out successfully!")
        res.redirect("/listings")
    })
}