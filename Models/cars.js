const mongoose=require('mongoose')

const CarSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    cartype:{
        type:String,
        required:true
    },
    charge:{
        type:Number,
        required:true
    },
    bookingStatus:{
        type:Boolean,
        required:true,
        default:false
    },
    contactNumber:{
        type:String,
        required:true
    },
    carModel:{
        type:String,
        required:true
    }
})

const CarModel=mongoose.model("car",CarSchema)

module.exports=CarModel