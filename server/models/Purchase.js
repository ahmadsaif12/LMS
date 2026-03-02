import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course',
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


const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema);

export default Purchase;