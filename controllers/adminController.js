import Booking from '../model/Booking.js';

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