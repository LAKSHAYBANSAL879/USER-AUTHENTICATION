const mongoose=require('mongoose')
const JWT=require('jsonwebtoken')
const bycrupt=require('bcrypt')
const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Name is req']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique :true,
        lowercase:true,
        unique:[true,'user is already registred']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minLength:[5,"Min length should be 5"],
        maxLength:[10,"Max length should be 10"]

    },
    confirmpassword:String,
    forgotpasstoken:{
        type:String
    },
    forgotpasswordexpiry:{
        type:Date
    }
},{
    timestamps:true
})
userSchema.pre('save',async function(next){
if(!this.isModified('password')){
return next();
}
this.password=await bycrupt.hash(this.password,10);
return next();
})
userSchema.methods={
    jwtToken(){
        return JWT.sign(
            {
                id:this._id,email:this.email
            },
            process.env.SECRET,
            {expiresIn:'48h'}
        );
    },
}
module.exports=mongoose.model("User",userSchema)