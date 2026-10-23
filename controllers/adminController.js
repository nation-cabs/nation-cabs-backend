import Booking from '../model/Booking.js';
import Driver from '../model/Driver.js';

export const getAllBookings = async (req, res) => {
    try {

        const bookings = await Booking.getAllBookings();
        res.status(200).json({
            message: "Bookings retrieved successfully",
            bookings: bookings
        });

    }catch (error) {
        console.error("Error retrieving bookings:", error);
        res.status(500).json({
            message: "Failed to retrieve bookings",
            error: error.message
        });
        
        return res.status(500).json({ message: "Failed to retrieve bookings." });
    }
}

export const getBookingByCustomerId = async (req, res) => {

const { customerId } = req.params;

try{

    const bookings = await Booking.getBookingByCustomerId(customerId);

    if (!bookings || bookings.length === 0) {

        res.status(404).json({
            message:  "No bookings found for this customer"
        })
    }

    res.status(200).json({
        message: "Bookings retrieved successfully",
        bookings: bookings
    });

} catch (error) {
    console.error("Error retrieving booking:", error);

    res.status(500).json({
        message: "Failed to retrieve booking",
        error: error.message
    });
}

}

export const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { booking_status = "Confirmed" } = req.body;

    try {
        console.log("ID received:", id);

        // Check whether the booking exists before updating
        const existingBooking = await Booking.getBookingById(id);

        console.log("Existing booking:", existingBooking);

        if (!existingBooking) {
            return res.status(404).json({
                message: "Booking not found",
                searchedId: id
            });
        }

        const updatedBookingStatus =
            await Booking.updateBookingStatus(id, booking_status);

        console.log("Updated booking:", updatedBookingStatus);

        if (!updatedBookingStatus) {
            return res.status(500).json({
                message: "Booking update could not be verified"
            });
        }

        return res.status(200).json({
            message: "Booking status updated successfully",
            booking: updatedBookingStatus
        });

    } catch (error) {
        console.error("Error updating booking status:", error);

        return res.status(500).json({
            message: "Failed to update booking status",
            error: error.message
        });
    }
};

export const getApprovedDrivers = async (req, res) => {

    try{

        const drivers = await Driver.getApprovedDrivers();

        if(!drivers){
            return res.status(404).json({
                message: "No driver found"
            })
        }

       return  res.status(200).json({
        message: "Drivers retrieved sucessfully!",
        count: drivers.length,
        drivers,
       })
    } catch (error) {

        console.error("Error fetching approved drivers", error);

        return res.status(500).json({
            message: "Failed to retrieve approved drivers",
            error: error.message
        });
    }
}

export const assignDriverToBooking = async (req, res) => {
    try{
    const { id } = req.params;
    const { driver_id } = req.body;

    if (!driver_id) {
        return res.status(400).json({
            message: "Driver is not selected"
    })
}
     // Check whether the booking exists before assigning a driver

     const booking = await Booking.getBookingById(id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }
    
        const approvedDrivers = await Driver.getApprovedDrivers();

        const isApprovedDriver = approvedDrivers.some(driver => driver.id === driver_id);

        if (!isApprovedDriver) {
            return res.status(400).json({
                message: "Selected driver is not approved"
            });
        }

        const assignedDriver = await Booking.assignDriver(id, driver_id);

        return res.status(200).json({
            message: "Driver assigned to booking successfully",
            booking: assignedDriver
        });


 } catch (error) {

        console.error("Error assigning driver to booking:", error);
        
        return res.status(500).json({
            message: "Failed to assign driver to booking",
            error: error.message
        });
    }

}