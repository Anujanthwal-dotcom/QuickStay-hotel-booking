import User from '../models/User.js'


export const protect = async (req,res,next)=>{
    const userId = req.auth().userId;
    
    if(!userId){
        res.json({success:false,message:"Authentication failed"});
    }

    const user = await User.findById({_id:userId});

    req.user = user;

    next();
}