import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import Purchase from '../models/Purchase.js';
import Course from "../models/Course.js";
import mongoose from "mongoose";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// CLERK WEBHOOK 
export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const payload = JSON.stringify(req.body); 

        await whook.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: (data.first_name || "") + " " + (data.last_name || ""),
                    imageUrl: data.image_url || "",
                };
                await User.create(userData);
                return res.json({ success: true });
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: (data.first_name || "") + " " + (data.last_name || ""),
                    imageUrl: data.image_url || "",
                };
                await User.findByIdAndUpdate(data.id, userData);
                return res.json({ success: true });
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true });
            }
            default:
                return res.json({ success: true });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// STRIPE WEBHOOK
export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("❌ Signature Verification Failed:", err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Unified Success Handler
    const handlePaymentSuccess = async (session) => {
        try {
            const { purchaseId, userId, courseId } = session.metadata;

            // 1. Update Purchase Record to 'completed'
            const purchaseData = await Purchase.findById(purchaseId);
            
            if (purchaseData && purchaseData.status !== 'completed') {
                purchaseData.status = 'completed';
                await purchaseData.save();

                // 2. Add course to User's enrolledCourses
                // courseId is stored as ObjectId in DB, metadata is a String
                await User.findByIdAndUpdate(userId, { 
                    $addToSet: { enrolledCourses: new mongoose.Types.ObjectId(courseId) } 
                });

                // 3. Add user to Course's enrolledStudents
                await Course.findByIdAndUpdate(courseId, { 
                    $addToSet: { enrolledStudents: userId } 
                });

                console.log(`✅ SUCCESS: User ${userId} enrolled in ${courseId}`);
            }
        } catch (error) {
            console.error("❌ Webhook Logic Error:", error.message);
        }
    };

    // Routing Stripe Events
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            // Lookup session to find metadata if it's not in the intent
            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id,
            });
            if (sessions.data.length > 0) {
                await handlePaymentSuccess(sessions.data[0]);
            }
            break;
        }
        case 'checkout.session.completed': {
            const session = event.data.object;
            await handlePaymentSuccess(session);
            break;
        }
        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id,
            });
            if (sessions.data.length > 0) {
                const { purchaseId } = sessions.data[0].metadata;
                await Purchase.findByIdAndUpdate(purchaseId, { status: 'failed' });
            }
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
};