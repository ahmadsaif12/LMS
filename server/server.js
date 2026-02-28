import express from "express";
import "dotenv/config";
import cors from 'cors';
import ConnectDb from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

// 1. Database Connection
await ConnectDb();

// 2. Enable CORS (Crucial for React -> Backend communication)
app.use(cors());

// 3. Clerk Webhook Route (MUST be raw for Svix verification)
app.post(
    '/clerk', 
    express.json(),
    clerkWebhooks
);

// 4. Regular JSON Middleware (Placed AFTER the webhook route)
app.use(express.json());

// 5. Test Route
app.get("/", (req, res) => {
    res.send("API is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
});