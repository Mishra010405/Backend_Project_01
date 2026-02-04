import { application } from "express";
import {asynchandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/Apierrors.js";
import {User} from "../models/User.models.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { access } from "fs";
import jwt from "jsonwebtoken";

const registerUser = asynchandler(async (req,res) => {
    // res.status(200).json({
        // message:"Ok,My name is Shivam Mishra"
        // get the user Detailed from fruntend.
        // vlidation- not empty
        // Check if the user already exist.
        // Check for images , check for avtar.
        // Upload them to cloudinary, avtar
        // creae user object - create enyrt in db
        // remove password and refresh token field from the response
        // Check for user creation
        // return res
    // })

    const {fullname  , username, email, password} = req.body
    

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

    const existedUser = await User.findOne({
        $or: [{username} , {email}]
    })

    if(existedUser){
        throw new ApiError(400,"User with email or all user existed")
    }

    const avatarLocalPath = req.files?.avatar[0].path
    
    
    // const coverImageLocalPath = req.files?.coverImage[0]?.pa

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
console.log("File: ",req.files);

    if(!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
    }
    
    const avatar = await uploadonCloudinary(avatarLocalPath)
    const coverImage = await uploadonCloudinary(coverImageLocalPath)
    
    
    if(!avatar) {
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createUser, "User registered Successfully")
    )
})

const generateAccessandRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateaccessToken();
        const refreshToken = user.genrateRefreshToken();
    }

    catch (error) {
        throw new ApiError(500, " Something went wrong while generating refresh and access token" )
    } 

}

const loginUser = asynchandler(async (req,res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

 

    const { email, username, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } =
        await generateAccessandRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
})



const logoutUser = asynchandler(async(req,res) => {
    await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            refreshToken: undefined
        }
    },
    {
        new : true
    }

    )



    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
})


const refreshAccessToken = asynchandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    
    if(!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try{
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if(!user) {
        throw new ApiError(401, "Invalid refresh toekn")
    }
    
    if(!incomingRefreshToken != user?.refreshToken) {
        throw new ApiError(401, "Refresh toekn is expired or used")

    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken , newRefreshToken} =  await
    generateAccessandRefreshToken(user._id)


    return res 
    .status(200)
    .cookie("accessToken" , accessToken, options)
    .cookie("refreshToken" , newRefreshToken, options)
    .json(
        new ApiResponse(
            200,
            {accessToken , refreshToken : newRefreshToken},
            "Access TOken refreshed"
        )
    )

}

    catch(error) {
        throw new ApiError(400, "Some thing went wrong ")
    }


})



const changeCurrentPassword = asynchandler(async(req,res) => {
    const {oldPassword , newPassword , confPassword} = req.body

    const user = await user.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)


    if(!isPasswordCorrect) {
        throw new ApiError(401, "Invalid old Password")
    }

    user.password = newPassword 
    await user.saved({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {} , "Password Changed Successfully"))
})



const getCurrentUser = asynchandler(async(req,res) => {
    return res
    .status(200)
    .json(200, req.user, "Current user fetched successfully")
})


const updateAccountDetails = asynchandler(async(req, res) => {
    const {fullname , email} = req.body 
    if(!fullname || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email: email
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user , "Account Details updated Successfully"))
})


const updateUserAvtar = asynchandler(async(req,res) => {
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath) {
        throw new ApiError(400 , "Avatar file is missing")
    }

    const avatar = await uploadonCloudinary
    (avatarLocalPath)

    if(!avatar.url) {
        throw new ApiError(400 , "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")
    return res
    .status(200)
    .json(ApiResponse(200, user, "Avatar updated success fully"))
})

const updateUsercoverImg = asynchandler(async(req,res) => {
    const coverImageLocalPath = req.file?.path

    if(!avatarLocalPath) {
        throw new ApiError(400 , "Avatar file is missing")
    }

    const coverImage = await uploadonCloudinary
    (coverImageLocalPath)

    if(!coverImage.url) {
        throw new ApiError(400 , "Error while uploading on avatar")
    }

    const user  = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(ApiResponse(200, user, "Cover Image updated success fully"))
})


const getUserChannelProfile = asynchandler(async (req,res) => {
    const {username} req.params

    if(!username)
})

export { registerUser,
    loginUser,
    logoutUser, 
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails  ,
    updateUserAvtar,
    updateUsercoverImg  
}
 
