import express from "express";
import "dotenv/config";
import cors from 'cors';
import ConnectDb from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from '@clerk/express'; 
import { connectCloudinary } from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhooks } from './controllers/webhooks.js';

const app = express();

// Database & Cloudinary Connections
await ConnectDb();
await connectCloudinary();

// 1. Global Middleware
app.use(cors());

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// 3. Body Parsing Middleware (For all other routes)
app.use(express.json());

// 4. Clerk Webhook (Clerk uses JSON, so it can go after express.json())
app.post('/clerk', clerkWebhooks);

// 5. Auth Middleware
app.use(clerkMiddleware());

// 6. API Routes
app.get("/", (req, res) => {
    res.send("API is working");
});

app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});