import validator from "validator"

export const validateDriverApplication = (data) =>{

const {
    firstName,
        lastName,
        email,
        phone,

        dateOfBirth,
        gender,

        province,
        city,
        address,

        licenseNumber,
        licenseExpiry,

        pdpNumber,
        pdpExpiry,

        drivingExperience,

        emergencyName,
        emergencyRelationship,
        emergencyPhone
} = data;

 if (!firstName || firstName.length < 2)
        return "First name is required.";

    if (!lastName || lastName.length < 2)
        return "Last name is required.";

    if (!validator.isEmail(email))
        return "Invalid email.";

    if (!phone)
        return "Phone number is required.";

    if (!dateOfBirth)
        return "Date of birth is required.";

    if (!gender)
        return "Gender is required.";

    if (!province)
        return "Province is required.";

    if (!city)
        return "City is required.";

    if (!address)
        return "Address is required.";

    if (!licenseNumber)
        return "License number is required.";

    if (!licenseExpiry)
        return "License expiry is required.";

    if (!pdpNumber)
        return "PDP number is required.";

    if (!pdpExpiry)
        return "PDP expiry is required.";

    if (!drivingExperience)
        return "Driving experience is required.";

    if (!emergencyName)
        return "Emergency contact name is required.";

    if (!emergencyRelationship)
        return "Emergency relationship is required.";

    if (!emergencyPhone)
        return "Emergency phone is required.";

    return null;

};