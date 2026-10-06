import User from '../model/User.js';

export const getProfile = async(req, res)=>{
    try{
        const userId = req.user.id;
        const user = await User.findUserById(userId);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({
            message: "User profile retrieved successfully",
            user
        });
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}