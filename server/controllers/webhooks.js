import { Webhook } from "svix";
import User from "../models/User.js";

//manage clerk user from databases

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    name: `${data.first_name} ${data.last_name}`,
                    email: data.email_addresses[0].email_address,
                    imageUrl: data.image_url, 
                    enrolledCourses: []
                };
                await User.create(userData);
                return res.status(201).json({ success: true, message: 'User Sync Success' });
            }

            case 'user.updated': {
                const updatedData = {
                    name: `${data.first_name} ${data.last_name}`,
                    email: data.email_addresses[0].email_address,
                    imageUrl: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, updatedData);
                return res.status(200).json({ success: true, message: 'User Updated' });
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                return res.status(200).json({ success: true, message: 'User Removed' });
            }

            default:
                return res.status(400).json({ success: false, message: 'Unhandled event' });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};