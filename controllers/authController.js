import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "../model/User.js"
import dotenv from "dotenv"

dotenv.config()
import {validateSignup, validateLogin} from "../utils/validateAuth.js"
import { sendVerificationEmail } from "../services/emailService.js";

//====================Signup=====================

export const signup= async (req, res) => {
    try{
        const error = validateSignup(req.body);

if (error) {
    return res.status(400).json({
        message: error
    });
}
 const {
    firstName,
    lastName,
    email,
    phone,
    password,
     confirmPassword,
    role
} = req.body;

if(
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password 
   
){
    return res.status(400).json(
        {message: "All fields are required"}
    )
}

const existingUser = await User.findByEmail(email);

if (existingUser) {
    return res.status(409).json({
        message: "User with this email already exists"
    });
}

if (password !== confirmPassword) {
    return res.status(400).json({
        message: "Passwords do not match."
    });
}

//=======hash password ======

const hashedPassword = await bcrypt.hash(password, 10);



const newUser = await User.createUser({
    firstName,
    lastName,
    email,
    phone,
    hashedPassword,
    role
});

const verificationToken = jwt.sign(
    {
        email: newUser.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "24h"
    }
);
await sendVerificationEmail(
    newUser.email,
    verificationToken
);

res.status(201).json({
    message: "Registration successful. Please verify your email.",
    
});
    }
    catch(error){
        res.status(500).json({message: "something went wrong"})
    }
};

//====================Login=====================

export const login = async (req, res) => {
try{

    const error = validateLogin(req.body);

if(error){

    return res.status(400).json({
        message:error
    });

}

    const {email, password} = req.body;

    if(!email || !password)
    {
        return res.status(400).json(
            {message: "All fields are required"}
        )
    }


 const user = await User.findUserByEmail(email);

if (!user) {
    return res.status(404).json({
        message: "Invalid email or password."
    });
}

    const isPasswordMatch = await bcrypt.compare(password, user.password)


    if(!isPasswordMatch)
    {return res.status(400).json({message: "invalid password"})


    }

    

    if (!user.is_verified) {
    return res.status(403).json({
        message: "Please verify your email before logging in."
    });
}


//==============Tokenization========================

    const token = jwt.sign(
        {id: user.id, 
            email: user.email,
        role: user.role}, 
        process.env.JWT_SECRET,
        { expiresIn: "1h"}
    );
    
    res.status(200).json({
        message: "Login Successful",
        token,
        user: {
            id: user.id,
             firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
           role: user.role
        }
    });

} catch(error)
{
    console.error(error);

    res.status(500).json({
        message: error.message
    });
}
};



