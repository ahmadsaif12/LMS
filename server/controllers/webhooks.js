import { Webhook } from "svix";
import User from '../models/User.js';
import stripe from '../configs/stripe.js';
import Course from '../models/Course.js';

// Controller to handle Clerk Webhooks
export const clerkWebhooks = async (req, res) => {
    try {
        // 1. Create a Svix instance with your Clerk Webhook Secret
        const whse = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // 2. Verify the headers to ensure the request is actually from Clerk
        await whse.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        // 3. Extract data and type from the request body
        const { data, type } = req.body;

        // 4. Handle different Event Types
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                    enrolledCourses: [],
                };
                await User.create(userData);
                console.log(` SUCCESS: User created: ${data.id}`);
                res.json({ success: true, message: 'User created' });
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, userData);
                console.log(` SUCCESS: User updated: ${data.id}`);
                res.json({ success: true, message: 'User updated' });
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                console.log(`🗑️ SUCCESS: User deleted: ${data.id}`);
                res.json({ success: true, message: 'User deleted' });
                break;
            }

            default:
                break;
        }

    } catch (error) {
        console.log("Webhook Error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}


export const stripeWebhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.CLERK_WEBHOOK_SECRET 
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the successful payment event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { courseId, userId } = session.metadata;

        try {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { enrolledCourses: courseId }
            });
            await Course.findByIdAndUpdate(courseId, {
                $addToSet: { enrolledStudents: userId }
            });

            console.log(` Enrollment Successful: User ${userId} -> Course ${courseId}`);
        } catch (error) {
            console.error('Database Update Error:', error.message);
            return res.status(500).json({ message: "Database update failed" });
        }
    }
    res.json({ received: true });
};