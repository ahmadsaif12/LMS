import express from "express";
import "dotenv/config";
import cors from 'cors';
import ConnectDb from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from '@clerk/express'; 
import { connectCloudinary } from "./configs/cloudinary.js";

const app = express();
await ConnectDb();
await connectCloudinary();
app.use(cors());

app.post('/clerk', express.json(), clerkWebhooks);
app.use(express.json());
app.use(clerkMiddleware());

// 6. Routes
app.get("/", (req, res) => {
    res.send("API is working");
});

// Educator Routes
app.use("/api/educator/", educatorRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server listening on ${PORT}`);
});