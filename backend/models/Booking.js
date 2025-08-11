import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    user:{
        type:String,
        ref:"User",
        require:true
    },
    room:{
        type:String,
        ref:"Room",
        require:true,
    },
    hotel:{
        type:String,
        ref:"Hotel",
        require:true
    },
    checkInDate:{
        type:Date,
        require:true
    },
    checkOutDate:{
        type:Date,
        require:true
    },
    totalPrice:{
        type:Number,
        require:true
    },
    guests:{
        type:Number,
        require:true
    },
    status:{
        type:String,
        enum:['cancelled','confirmed','pending'],
        default:'pending',
    },
    paymentMethod:{
        type:String,
        require:true,
        default:"Pay At Hotel"
    },
    isPaid:{
        type:Boolean,
        default:false
    }
},{timestamp:true});


const Booking = mongoose.model("Booking",bookingSchema);

export default Booking;
