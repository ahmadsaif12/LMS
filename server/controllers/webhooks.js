import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { request, response } from "express";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const payload = JSON.stringify(req.body); // Use req.rawBody if available

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
                return res.json({});
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: (data.first_name || "") + " " + (data.last_name || ""),
                    imageUrl: data.image_url || "",
                };
                await User.findByIdAndUpdate(data.id, userData);
                return res.json({});
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                return res.json({});
            }

            default:
                return res.status(400).json({ success: false, message: "Unhandled event type" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        // request.body MUST be the raw buffer from express.raw() in server.js
        event = stripeInstance.webhooks.constructEvent(
            request.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`❌ Webhook Signature Error: ${err.message}`);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the specific event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { purchaseId } = session.metadata;

        try {
            const purchaseData = await Purchase.findById(purchaseId);

            if (!purchaseData) {
                console.error("Purchase record not found for ID:", purchaseId);
                return response.json({ received: true }); 
            }

            // Prevent double-processing
            if (purchaseData.status === 'completed') {
                return response.json({ received: true });
            }

            // 1. Update Course (Add student to list)
            await Course.findByIdAndUpdate(purchaseData.courseId, {
                $addToSet: { enrolledStudents: purchaseData.userId }
            });

            // 2. Update User (Add course to enrolled list)
            await User.findByIdAndUpdate(purchaseData.userId, {
                $addToSet: { enrolledCourses: purchaseData.courseId }
            });

            // 3. Mark Purchase as Completed
            purchaseData.status = 'completed';
            await purchaseData.save();

            console.log(`✅ Enrollment Successful for Purchase: ${purchaseId}`);
        } catch (error) {
            console.error("Database Update Error:", error.message);
            return response.status(500).json({ success: false });
        }
    }

    // Acknowledge receipt to Stripe
    response.json({ received: true });
};