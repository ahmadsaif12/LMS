import { clerkClient } from '@clerk/express';

export const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized: Please log in first' 
            });
        }
        const user = await clerkClient.users.getUser(userId);

        if (user.publicMetadata?.role !== 'educator') {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden: Educator access required' 
            });
        }

        next();
    } catch (error) {
        console.error(" Auth Middleware Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};