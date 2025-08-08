import User from "../models/User.js";
import { Webhook } from "svix";


const clerkWebhooks = async (req,res)=>{
    try {
        //svix instance
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //getting headers
        const headers = {
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"],
        }

        //verify headers
        await whook.verify(JSON.stringify(req.body),headers);

        //getting data from req body
        const {data, type} = req.body

        const userData = {
            _id:data.id,
            email:data.email_addresses[0].email_address,
            username:data.first_name+" "+data.last_name,
            image:data.image_url,
        }

        console.log(userData);

        //cases in events

        switch(type){
            case "user.created":
                {
                    const user = new User(userData);
                    user.save();
                    break;
                }

            case "user.updated":
                {
                    await User.findByIdAndUpdate(data.id,userData);
                    break;
                }
            case "user.deleted":
                {
                    await User.findByIdAndDelete(data.id);
                    break;
                }
            default:
                {
                    break;
                }
        }

        res.json({success:true,message:"Webhook Received"});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

export default clerkWebhooks;