import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
    hotel:{
        type:String,
        ref:"Hotel",
        require:true
    },
    roomType:{
        type:String,
        require:true,
    },
    pricePerNight:{
        type:Number,
        require:true
    },
    amenities:{
        type:Array,
        require:true
    },
    images:[
        {type:String}
    ],
    isAvailable:{
        type:Boolean,
        default:true
    }
},{timestamp:true});


const Room = mongoose.model("Room",roomSchema);

export default Room;
