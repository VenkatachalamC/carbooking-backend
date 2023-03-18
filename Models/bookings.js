const mongoose=require('mongoose')
const Bookings=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    carowner:{
        type:String,
        required:true
    },
    cartype:{
        type:String,
        required:true
    },
    bookingDate:{
        type:String,
        required:true
    },
    carModel:{
        type:String,
        required:true
    },
    charge:{
        type:String,
        required:true
    }
})

const BookingModel=mongoose.model("Booking",Bookings)
module.exports=BookingModel