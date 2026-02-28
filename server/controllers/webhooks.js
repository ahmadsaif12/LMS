import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
        
        if (!WEBHOOK_SECRET) {
            console.error("CLERK_WEBHOOK_SECRET missing in .env");
            return res.status(400).json({ success: false, message: "Missing Secret" });
        }

        // --- THE DEBUGGER ---
        console.log("---  Incoming Request Details ---");
        console.log("Method:", req.method);
        console.log("User-Agent (Who is calling?):", req.headers["user-agent"]);
        console.log("svix-id Header:", req.headers["svix-id"] || "MISSING ");
        // --------------------

        const svix_id = req.headers["svix-id"];
        const svix_timestamp = req.headers["svix-timestamp"];
        const svix_signature = req.headers["svix-signature"];

        // If headers are missing, the request is NOT coming from Clerk's Webhook system
        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.error("REJECTED: This request did not come from Clerk (Missing Svix Headers)");
            return res.status(400).json({ 
                success: false, 
                message: "Missing Svix Headers. Are you accidentally calling this from React/Postman?" 
            });
        }

        const payload = req.body.toString();
        const wh = new Webhook(WEBHOOK_SECRET);

        let evt;

        try {
            evt = wh.verify(payload, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            });
            console.log(" Webhook Verified Successfully (It came from Clerk!)");
        } catch (err) {
            console.error(' Verification failed: Signature mismatch. Check your CLERK_WEBHOOK_SECRET.');
            return res.status(400).json({ success: false, message: 'Invalid Signature' });
        }

        const { data, type } = evt;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || "New User",
                    email: data.email_addresses?.[0]?.email_address ?? `user-${data.id}@clerk.com`,
                    imageUrl: data.image_url || "",
                    enrolledCourses: []
                };
                
                await User.findByIdAndUpdate(data.id, userData, { upsert: true, new: true });
                console.log(" SUCCESS: User saved to MongoDB Atlas:", data.id);
                return res.status(201).json({ success: true });
            }

            case 'user.updated': {
                const updatedData = {
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                    email: data.email_addresses?.[0]?.email_address,
                    imageUrl: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, updatedData);
                console.log(" User updated in MongoDB");
                return res.status(200).json({ success: true });
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                console.log(" User deleted from MongoDB");
                return res.status(200).json({ success: true });
            }

            default:
                return res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error(' Webhook Controller Crash:', error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};