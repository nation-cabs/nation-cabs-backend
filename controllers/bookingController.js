
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