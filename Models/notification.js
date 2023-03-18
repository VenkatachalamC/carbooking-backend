const mongoose=require('mongoose')

const NotificationSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }
})

const NotificationModel=mongoose.model("notification",NotificationSchema)

module.exports=NotificationModel;