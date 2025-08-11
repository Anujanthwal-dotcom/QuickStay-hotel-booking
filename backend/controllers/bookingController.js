import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import transporter from "../config/nodemailer.js";

//function to check room availability
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    //:) because at a particular period, room can be occupied only by a single guest/group.
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
};

//api for availability
//post /api/bookings/check-availability

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = checkAvailability({ checkInDate, checkOutDate, room });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API to create a new booking
//post /api/bookings/book

export const createBooking = async (req, res) => {
  try {
    let { room, checkInDate, checkOutDate, guest } = req.body;
    const user = req.user._id;

    //before booking check availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    //Get total price
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;
    //calculate final price
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDifference = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));

    totalPrice *= nights; // why not guests, because single room is booked by any guest for a group.

    guest = parseInt(guest,10);
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: guest,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const mailOption = {
      from:process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Hotel Booking Details",
      html: `
        <h2>Your Booking Details</h2>
        <p>Dear ${req.user.username},</p>
        <p>Thankyou for booking! Here are your booking details.</p>
        <ul>
        <li><strong>Booking ID:</strong> ${booking._id}</li>
        <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
        <li><strong>Location:</strong> ${roomData.hotel.address}</li>
        <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
        <li><strong>Booking Amount:</strong>${process.env.CURRENCY || '$'} ${booking.totalPrice}</li>
        </ul>
        <p>We look forward to welcome you.</p>
        <p>If you need to make any changes, feel free to contact us.</p>
      `,
    };
    console.log(req.user);
    
    await transporter.sendMail(mailOption);

    res.json({ success: true, message: "Booking completed successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Failed to book" });
  }
};

//api to get all booking of a user
// GET /api/bookings/user

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "failed to fetch bookings" });
  }
};

export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth().userId });

    if (!hotel) {
      return res.json({ success: false, message: "No Hotel Found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    //total bookings

    const totalBookings = bookings.length;

    //total revenue
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};
