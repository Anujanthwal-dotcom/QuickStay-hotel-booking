import mongoose from "mongoose";

const hotelSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  contact: {
    type: String,
    require: true,
  },
  owner: {
    type: String,
    require: true,
    ref:"User"
  },
  city:{
    type:String,
    require:true,
  }
},{timestamp:true});


const Hotel = mongoose.model("Hotel",hotelSchema);

export default Hotel;
