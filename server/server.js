import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinay from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

// initialize express 
const app = express();

// connect to db
await connectDB();
await connectCloudinay();

// --- 1. Basic Middleware ---
app.use(cors());
app.use(clerkMiddleware());

app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks);

// --- 3. Routes & Global JSON Parsing ---
app.get('/', (req,res)=>{res.send("Edemy API is working fine!")})

// Clerk Webhook
app.post('/clerk', express.json(), clerkWebhooks);
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);

// port
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
})