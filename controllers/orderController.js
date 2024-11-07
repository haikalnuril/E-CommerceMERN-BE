import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const createOrder = asyncHandler(async (req, res) => {

    const {email, firstName, lastName, phone, cartItem } = req.body;

    if(!cartItem || cartItem.length < 1) {
        res.status(400);
        throw new Error("Cart is empty");
    }

    let orderItem = []

    let total = 0;

    for ( const cart of cartItem) {
        const productData = await Product.findOne({_id: cart.product});
        if(!productData) {
            res.status(400);
            throw new Error("Product not found");
        }
        const {name, price, _id} = productData;
        const singleProduct = {
            quantity: cart.quantity,
            name,
            price,
            product: _id
        }
        orderItem = [...orderItem, singleProduct]

        total += cart.quantity * price;
    }

    const order = await Order.create({
        itemsDetail: orderItem,
        total,
        firstName,
        lastName,
        email,
        phone,
        user: req.user.id
    })

    return res.status(201).json({
        total,
        order,
        status: "success",
        message: "Product created successfully",
    });
});

export const allOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find()

    return res.status(200).json({
        status: "success",
        message: "All orders",
        data: orders
    });
});

export const detailOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    res.status(200).json({
        status: "success",
        message: "Detail order",
        data: order
    });
});

export const currentOrder = asyncHandler(async (req, res) => {
    const order = await Order.find({user: req.user.id});

    res.status(200).json({
        status: "success",
        message: "Current order",
        data: order
    });
})
