if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js");

const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")

const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")



const dbUrl = process.env.ATLASDB_URL


async function main() {
  await mongoose.connect(dbUrl);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main()
.then(()=>{
    console.log("connected to database")})
.catch(err => console.log(err));



app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname,"public")))

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
})

store.on("error",()=>{
    console.log("ERROR IN MONGO STORE", err)
})
const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 7 *24*60*60*1000,
        maxAge:  7 *24*60*60*1000,
        httpOnly: true,
    }
}


// app.get("/", (req,res)=>{
//     res.send("hi I am root")
// })


app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    // console.log(res.locals.success); 
    res.locals.currUser = req.user;
    next()
})

// demo user

// app.get("/demouser", async (req, res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username : "delta-student", //passport lets us create username 
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld") // static method in passport and hello world is the password
  
//     res.send(registeredUser)
    
// })

// listings
app.use("/listings", listingRouter);
// reviews
app.use("/listings/:id/reviews", reviewsRouter);
//users
app.use("/", userRouter);


// Error Handling Middleware
app.use((err,req,res,next)=>{
    // res.send("SOME ERROR OCCURED") we will send custom error msg
    let {status=500, message="Some thing went error"}=err;
    // res.render("error.ejs")
    res.status(status).send(message);
})


app.listen(8080,()=>{
    console.log("app is listening");
});