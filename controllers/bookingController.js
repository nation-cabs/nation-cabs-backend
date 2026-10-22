
import Booking from "../model/Booking.js"

export const createBooking = async (req, res) =>{

try{

    const {
        pickup_location,
        dropoff_location,
        pickup_datetime,
        passengers,
        vehicle_type,
        special_instructions
    } = req.body

    if(
        !pickup_location ||
        !dropoff_location ||
        !pickup_datetime 
    )
    return res.status(400).json({
        message: " Required Pick Location, Dropoff location, or pickup time missing"
    })

       const customer_id = req.user.id ;

       console.log(customer_id)

    const booking = await Booking.createBooking({
        customer_id,
        pickup_location,
        dropoff_location,
        pickup_datetime,
        passengers,
        vehicle_type,
        special_instructions
    })
    
    console.log(booking);

    res.status(201).json({
        message: " Booking created successfully "
    })

}
  catch(error)
  {
     res.status(500).json({
        message: error.message
    });
  }

}

export const getBookings = async (req, res) => {
     try { 
        const customer_id = req.user.id; 
        const bookings = await Booking.getBookingByCustomerId(customer_id);

        return res.status(200).json({ bookings }); 

    } catch (error) 
    
    { 
        
        console.error("Fetch customer bookings error:", error);
        
        return res.status(500).json({ message: "Failed to retrieve your bookings." }); 
    } 
};