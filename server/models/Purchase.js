import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'course', 
        required: true 
    },
    status: { 
        type: String, 
        required: true,
        default: 'pending'
    },
    amount: { 
        type: Number, 
        required: true 
    }
},{timestamps:true});

const Purchase = mongoose.models.purchase || mongoose.model('purchase', purchaseSchema);

export default Purchase;