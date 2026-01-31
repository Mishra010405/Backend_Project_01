import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: "davi4vrxb",
    api_key:  "573158481735621",
    api_secret: "oNQI6mVefT6vrFZeedQ9uwDrPzq"
});




const uploadonCloudinary = async(localfilePath) => {
    // console.log("LocalPath: hai ye ",localfilePath);
    // console.log("API key: ", );
   
    try{
        console.log("This is localpath  ",localfilePath);
        
        if(!localfilePath) return null
        console.log("Hello in cloud");
        
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("The file has been uploaded successfully",response.url);
        return response
    }
    catch (error) {
        fs.unlinkSync(localfilePath)
        console.log(error);
         // remove the locally 
        // saved temporary file ass the uoload operation got fialed
        return null;
    }
}

export {uploadonCloudinary}
