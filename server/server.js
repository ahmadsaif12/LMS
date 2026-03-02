import express from "express";
import "dotenv/config";
import cors from 'cors';
import ConnectDb from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from '@clerk/express'; 
import { connectCloudinary } from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
await ConnectDb();
await connectCloudinary();
const FRONTEND_URL = 'https://lms-frontend-nu-sage.vercel.app';

app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // required if using cookies/auth
}));

app.options('*', cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Stripe webhook needs raw body
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Clerk webhook
app.post('/clerk', clerkWebhooks);
app.use(clerkMiddleware());

app.get("/", (req, res) => {
    res.send("API is working");
});

app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});