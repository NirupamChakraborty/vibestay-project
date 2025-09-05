const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = 'mongodb://127.0.0.1:27017/vibestay';

async function main() {
  await mongoose.connect(MONGO_URL);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main()
.then(()=>{
    console.log("connected to database")})
.catch(err => console.log(err));

const initDB = async ()=>{
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>( {...obj, owner:'68b00efba8d0e83759598ec2'})); //new array is created with owner
   await Listing.insertMany(initData.data);
   console.log("Data was initialised")
}

initDB();