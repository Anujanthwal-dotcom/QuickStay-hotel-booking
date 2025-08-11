import Stripe from "stripe";
import Booking from "../models/Booking";

//api to handle stripe webhook

export const stripeWebhook = async(req,res)=>{
    //stripe gateway
    const stripeInstance = new stripeWebhook(process.env.STRIPE_SECRET_KEY);
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body,signature,process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        res.status(400).send(`Webhook Error:${error.message}`);
        return;
    }

    if(event.type==='payment_intent.succeeded'){
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        //getting metadata
        const session = await stripeInstance.checkout.session.list({
            paymentIntent:paymentIntentId,
        });

        const {bookingId} = session.data[0].metadata;

        //mark payment as paid
        await Booking.findByIdAndUpdate(bookingId,{isPaid:true,paymentMethod:'stripe'});
    } else{
        console.log("Unhandled event type:",event.type);
        return;
    }

    res.json({received:true});
}   