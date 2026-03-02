import { Webhook } from "svix";
import User from '../models/User.js';
import stripe from '../configs/stripe.js';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';

/**
 * Handle Clerk Webhooks (User Syncing)
 * Uses standard JSON body parsing via Svix
 */
export const clerkWebhooks = async (req, res) => {
    try {
        const whse = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify headers
        await whse.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url,
                    enrolledCourses: [],
                };
                await User.create(userData);
                console.log(`✅ SUCCESS: User created in DB: ${data.id}`);
                return res.json({ success: true });
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, userData);
                console.log(`✅ SUCCESS: User updated in DB: ${data.id}`);
                return res.json({ success: true });
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                console.log(`🗑️ SUCCESS: User deleted from DB: ${data.id}`);
                return res.json({ success: true });
            }

            default:
                return res.json({ success: true, message: "Event ignored" });
        }

    } catch (error) {
        console.error("❌ Clerk Webhook Error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Handle Stripe Webhooks (Payment & Enrollment)
 * IMPORTANT: req.body MUST be the raw buffer from express.raw()
 */
export const stripeWebhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Construct event using RAW body (Buffer)
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET 
        );
    } catch (err) {
        console.error(`❌ Stripe Signature Verification Failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Process the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Extract IDs from metadata (passed during checkout session creation)
        const { purchaseId, courseId, userId } = session.metadata;

        try {
            // 1. Finalize the Purchase record
            if (purchaseId) {
                await Purchase.findByIdAndUpdate(purchaseId, { status: 'completed' });
            }
            await User.findByIdAndUpdate(userId, {
                $addToSet: { enrolledCourses: courseId }
            });

            // 3. Add User to Course's statistics
            await Course.findByIdAndUpdate(courseId, {
                $addToSet: { enrolledStudents: userId }
            });

            console.log(`🎓 SUCCESS: User ${userId} successfully enrolled in ${courseId}`);
            
        } catch (error) {
            console.error(' Database Update Error:', error.message);
            // We return 500 so Stripe knows to retry this event later
            return res.status(500).json({ message: "Database update failed" });
        }
    }

    // Always acknowledge receipt to Stripe
    res.status(200).json({ received: true });
};