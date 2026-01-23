
import app from "./app.js";
import connectDb from "./db/index.js";



connectDb().then(() => {
    app.listen(process.env.PORT,() => {
        console.log(`The sadhvi is start carying at ${process.env.PORT}`);
        
    })
}).catch((error) => {
    console.log("Mongodb not Connecoted");
    
})