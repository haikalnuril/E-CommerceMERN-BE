import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name field cannot be empty'],
        unique: [true, 'Product name already exists'],
    },
    price: {
        type: Number,
        required: [true, 'Price field cannot be empty'],
    },
    description: {
        type: String,
        required: [true, 'Description field cannot be empty']
    },
    image: {
        type: String,
        default: null,
    },
    category: {
        type: String,
        required: [true, 'Category field cannot be empty'],
        enum:["shoes", "clothes", "tshirt", "pants"]
    },
    stock: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;