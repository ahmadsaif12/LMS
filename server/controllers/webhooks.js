export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    const handlePaymentSuccess = async (paymentIntent) => {
        try {
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!session.data.length) {
                console.error("No session data found for payment intent:", paymentIntentId);
                return;
            }

            const { purchaseId } = session.data[0].metadata;
            const purchaseData = await Purchase.findById(purchaseId);

            if (!purchaseData) {
                console.error("No purchase found for ID:", purchaseId);
                return;
            }

            const userData = await User.findById(purchaseData.userId);
            const courseData = await Course.findById(purchaseData.courseId.toString());

            if (!userData || !courseData) {
                console.error("User or Course not found");
                return;
            }

            // Add user to enrolled students
            courseData.enrolledStudents.push(userData._id);
            await courseData.save();

            // Add course to user's enrolled courses
            userData.enrolledCourses.push(courseData._id);
            await userData.save();

            // Update purchase status
            purchaseData.status = 'completed';
            await purchaseData.save();
        } catch (error) {
            console.error("Error handling payment success:", error);
        }
    };

    const handlePaymentFailed = async (paymentIntent) => {
        try {
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!session.data.length) {
                console.error("No session data found for failed payment intent:", paymentIntentId);
                return;
            }

            const { purchaseId } = session.data[0].metadata;
            const purchaseData = await Purchase.findById(purchaseId);

            if (!purchaseData) {
                console.error("No purchase found for ID:", purchaseId);
                return;
            }

            purchaseData.status = 'failed';
            await purchaseData.save();
        } catch (error) {
            console.error("Error handling payment failure:", error);
        }
    };

    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentSuccess(event.data.object);
            break;

        case 'payment_intent.payment_failed':
            await handlePaymentFailed(event.data.object);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
};



