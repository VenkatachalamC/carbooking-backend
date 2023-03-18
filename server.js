const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const BookingModel=require('./Models/bookings')
const UserModel=require('./Models/users')
const CarModel=require('./Models/cars')
const NotificationModel=require('./Models/notification')
const cors=require('cors')
const app=express()
const port=process.env.PORT||5000
app.use(cors({
    origin: 'https://carsharingplatform.netlify.app'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


mongoose.connect("mongodb+srv://test:test123@cluster0.kifneti.mongodb.net/carsharing").then((result)=>console.log("connected to database"))

app.listen(port,()=>{
    console.log(port)
})
app.post('/share',(req,res)=>{
    let car=new CarModel({
        userName:req.body.userName,
        cartype:req.body.cartype,
        charge:Number(req.body.charge),
        bookingStatus:false,
        contactNumber:req.body.contactNumber,
        carModel:req.body.carModel
    })
    const notification=new NotificationModel({
        username:req.body.userName,
        message:`car sharing successful.Car-Model:${req.body.carModel}.Car-type:${req.body.cartype}.charge:${req.body.charge}/day`,
        time:String(new Date())
    })
    notification.save()
    car.save().then(result=>res.json({status:"ok"}))
})
app.post('/signIn',(req,res)=>{
    UserModel.find({name:req.body.name})
    .then((result)=>{
        if(result.length==1){
            if(result[0].password==req.body.password){
                res.json({status:"ok"})
            }
            else{
                res.json({status:"incorrect password"})
            }
        }
        else{
            res.json({status:"user not found"})
        }
    })
})
app.post('/signUp',(req,res)=>{
    UserModel.find({name:req.body.username})
    .then((result)=>{
        if(result.length!=0){
            res.json({status:"username already taken"})
        }
        else{
            const user=new UserModel({
                name:req.body.username,
                password:req.body.password
            })
            user.save()
            .then(output=>res.json({status:"ok"}))
        }
    })
})
app.post('/book',(req,res)=>{
    CarModel.updateOne({userName:req.body.ownername,
        cartype:req.body.cartype,
        charge:req.body.rate,
        contactNumber:req.body.contactNumber,
        carModel:req.body.carmodel
    },
    {bookingStatus:true})
    .then((result)=>{})
    const booking=new BookingModel({
        username:req.body.name,
        carowner:req.body.ownername,
        cartype:req.body.cartype,
        bookingDate:String(new Date()),
        carModel:req.body.carmodel,
        charge:req.body.rate  
    })
    let not1=new NotificationModel({
        username:req.body.name,
        message:`car booking successful.cartype:${req.body.cartype},owner:${req.body.ownername},rate:${req.body.rate},Contact number:${req.body.contactNumber}`,
        time:String(new Date())
    })
    not1.save()
    let not2=new NotificationModel({
        username:req.body.ownername,
        message:`Your car has been booked by ${req.body.name},rate:${req.body.rate}`,
        time:String(new Date())
    })
    not2.save()
    booking.save().then((result)=>res.json({status:"ok"})) 
})
app.get('/cars/:name',(req,res)=>{
    let name=req.params.name;
    CarModel.find({bookingStatus:false,userName:{
        $nin:[name]
    }}).then(result=>res.send(result))
})
app.get('/bookings/:username',(req,res)=>{
    let name=req.params.username
    BookingModel.find({username:name}).then(result=>res.send(result))
})

app.get('/notifications/:name',(req,res)=>{
    let name=req.params.name
    NotificationModel.find({username:name}).then(result=>res.send(result))
})

app.delete('/cancel',(req,res)=>{
  let not1=new NotificationModel({
    username:req.body.username,
    message:"Your Cancellation is successful..",
    time:String(new Date())      
  })  
  let not2=new NotificationModel({
    username:req.body.ownername,
    message:`Your Car's booking have been cancelled by ${req.body.username}`,
    time:String(new Date())
  })
  not1.save()
  not2.save()
  BookingModel.findOneAndDelete({
    username:req.body.username,
    carowner:req.body.ownername,
    cartype:req.body.cartype,
    bookingDate:req.body.bookingdate,
    charge:req.body.charge,
    carModel:req.body.carmodel
}).then(result=>{
    CarModel.updateOne(
        {userName:req.body.ownername,
            cartype:req.body.cartype,
            charge:Number(req.body.charge),
            carModel:req.body.carmodel
        },{bookingStatus:false}).then(result2=>{res.json({status:"ok"})})
})
  
})