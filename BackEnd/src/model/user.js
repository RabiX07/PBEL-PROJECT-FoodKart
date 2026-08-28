import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true, 
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    order: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders'
    }], 
    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
    }],
    imgURL: {
        type: String,
        default: "",
    },
})

export default mongoose.model('Users', userSchema)