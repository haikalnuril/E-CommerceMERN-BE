import mongoose from 'mongoose';
const { Schema } = mongoose;

const singleProduct = Schema({
    name: {type:String, required: true},
    quantity: {type:Number, required: true},
    price: {type:Number, required: true},
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    }
})

const orderSchema = new Schema({
    total : {
        type: Number,
        required: [true, 'Total harga field cannot be empty'],
    },
    itemsDetail: [singleProduct],
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status : {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    firstName : {
        type: String,
        required: [true, 'First name field cannot be empty'],
    },
    lastName : {
        type: String,
        required: [true, 'Last name field cannot be empty'],
    },
    phone : {
        type: String,
        required: [true, 'Phone field cannot be empty'],
    },
    email : {
        type: String,
        required: [true, 'Email field cannot be empty'],
    }
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;