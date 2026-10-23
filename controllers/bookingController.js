
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


export const cancelCustomerBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const existingBooking = await Booking.getBookingById(id);

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (existingBooking.customer_id !== customerId) {
      return res.status(403).json({
        success: false,
        message: "You cannot cancel another customer's booking.",
      });
    }

    const updatedBooking = await Booking.cancelBooking(id, customerId);

    if (!updatedBooking) {
      return res.status(409).json({
        success: false,
        message:
          "This booking cannot be cancelled because its status does not permit cancellation.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ride cancelled successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel ride.",
    });
  }
};
