import validator from "validator"

export const validateSignup = (data) =>{

    const {
        firstName,
        lastName,
        email,
        phone,
        password,
           confirmPassword,
        role
    } = data;

    if(!firstName || firstName.trim().length < 2){
        return "First name must be at least 2 characters.";
    }

    if(!lastName || lastName.trim().length < 2){
        return "Last name must be at least 2 characters.";
    }

    if(!email){
        return "Email required.";
    }

    if(!validator.isEmail(email)){
        return "Invalid email address";
    }

    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';

     if (cleanPhone.length !== 10) {
     return "Invalid phone number";
    }

     if (!password) {
        return "Password is required.";
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
         return "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one symbol.";
    }
      
    if (password !== confirmPassword) {
    return "Passwords do not match.";
}

    const allowedRoles = ["customer", "driver", "admin"];

    if(!allowedRoles.includes(role)){
        return "Invalid role"
    }
   return null;

   
}

export const validateLogin = (data) =>{

    const {
        email,
        password
    } = data;

     if(!email){
        return "Email required.";
    }

    if(!validator.isEmail(email)){
        return "Invalid email address";
    }

      if (!password)
        return "Password is required.";

    return null;

}