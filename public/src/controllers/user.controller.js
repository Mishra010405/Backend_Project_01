import { application } from "express";
import {asynchandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/Apierrors.js";
import {User} from "../models/User.models.js";

const registerUser = asynchandler(async (req,res) => {
    res.status(200).json({
        message:"Ok,My name is Shivam Mishra"
        // get the user Detailed from fruntend.
        // vlidation- not empty
        // Check if the user already exist.
        // Check for images , check for avtar.
        // Upload them to cloudinary, avtar
        // creae user object - create enyrt in db
        // remove password and refresh token field from the response
        // Check for user creation
        // return res
    })

    const {fullname  , username, email, password} = req.body
    console.log(email);

    if(!fullname || fullname.trim() ===" "){
        throw new ApiError(400, "Full Name is required")
    }
    if(!username || username.trim() ===" "){
        throw new ApiError(400, "UserName is required")
    }
    if(!email || email.trim() ===" "){
        throw new ApiError(400, "Email is required")
    }
    if(!password || password.trim() ===" "){
        throw new ApiError(400, "Password is required")
    }

    const existedUser = User.findOne({
        $or: [{username} , {email}]
    })

    if(existedUser){
        throw new ApiError(400,"User with email or all user existed")
    }
})


export default registerUser