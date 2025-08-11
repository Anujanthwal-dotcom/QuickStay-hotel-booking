import express from 'express';
import "dotenv/config";
import cors from "cors";
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebHooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import { stripeWebhook } from './controllers/stripeWebHooks.js';


connectDB();
connectCloudinary();


const app = express();
app.use(cors());

//api for stripe
app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebhook);

app.use(express.json());
app.use(clerkMiddleware());


//api to listen clerk web hook
app.post("/api/clerk",clerkWebhooks);


app.get('/',(req,res)=>{res.send("API is working")})
app.use('/api/user',userRouter);
app.use('/api/hotels',hotelRouter);
app.use('/api/rooms',roomRouter);
app.use('/api/bookings',bookingRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>console.log(`Server started at ${PORT}`));