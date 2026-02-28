import express from "express"
import "dotenv/config"
import cors from 'cors'
import ConnectDb from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

//initialize projects 
const app =express();
// 1. Connect to DB & Cloudinary
await ConnectDb();

app.use(cors())

//Routes
app.get("/",async(req,res)=>{
    res.send("api working")
});
app.post('/clerk',express.json(),clerkWebhooks)

//Port
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is listening on ${PORT}`)
});
