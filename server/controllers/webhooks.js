import { Webhook } from "svix";
import User from '../models/User.js';

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