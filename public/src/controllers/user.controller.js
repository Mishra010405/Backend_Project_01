import {asynchandler} from "../utils/asynchandler.js";

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
})


export default registerUser