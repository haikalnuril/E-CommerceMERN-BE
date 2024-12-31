import product from "../models/productModel.js";
// import jwt from 'jsonwebtoken';
import asyncHandler from "../middlewares/asyncHandler.js";

import imagekit from "../lib/imagekit.js";

export const createProduct = asyncHandler(async (req, res) => {
    const newProduct = await product.create(req.body);

    res.status(201).json({
        status: "success",
        message: "Product created successfully",
        data: {
            product: newProduct,
        },
    });
});

export const allProducts = asyncHandler(async (req, res) => {
    const queryObj = { ...req.query };

    //fungsi untuk mengabaikan req.query.page dan limit
    const excludedFields = ["page", "limit", "name"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let query;
    let countQuery;

    if ("name" in req.query) {
        const nameRegex = {
            name: {
                $regex: req.query.name,
                $options: "i",
            },
        };
        query = product.find({
            ...queryObj,
            ...nameRegex,
        });

        countQuery = { ...queryObj, ...nameRegex };
    } else {
        query = product.find(queryObj);
        countQuery = queryObj;
    }

    //pagination
    const page = req.query.page * 1 || 1;
    const limitData = req.query.limit * 1 || 10;
    const skipData = (page - 1) * limitData;

    query = query.skip(skipData).limit(limitData);

    let totalData = await product.countDocuments(countQuery);
    if (req.query.page) {
        if (skipData >= totalData) {
            throw new Error("This page does not exist");
        }
    }

    const data = await query;
    const totalPage = Math.ceil(totalData / limitData);

    res.status(200).json({
        status: "success",
        message: "All products",
        data,
        pagination: {
            totalPage,
            page,
            totalProduct: totalData,
        },
    });
});

export const detailProduct = asyncHandler(async (req, res) => {
    const productDetail = await product.findById(req.params.id);

    if (!productDetail) {
        res.status(404).json({
            status: "failed",
            message: "Product not found",
        });
    }

    res.status(200).json({
        status: "success",
        message: "Product detail",
        data: productDetail,
    });
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, category, stock } = req.body;

    const updateProduct = await product.findByIdAndUpdate(req.params.id, {
        name,
        price,
        description,
        image,
        category,
        stock,
    });

    if (!updateProduct) {
        res.status(404).json({
            status: "failed",
            message: "Product not found",
        });
    }

    res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        data: {
            updateProduct,
        },
    });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const deleteProduct = await product.findByIdAndDelete(req.params.id);

    if (!deleteProduct) {
        res.status(404).json({
            status: "failed",
            message: "Product not found",
        });
    }

    res.status(200).json({
        status: "success",
        message: "Product deleted successfully",
    });
});

export const fileUpload = asyncHandler(async (req, res) => {
    const file = req.file;

    if (!file) {
        res.status(400);
        throw new Error("Please upload a file");
    }

    const split = file.originalname.split(".");
    const ext = split[split.length - 1];
    const filename = split[0];
    const fileBuffer = file.buffer;
    const fileName = `Product-${filename}-${Date.now()}.${ext}`;

    const uploadedFile = await imagekit.upload({
        file: fileBuffer,
        fileName: fileName,
    });

    const imageUrl = uploadedFile.url;

    const uploadProduct = await product.findByIdAndUpdate(
        req.params.id,
        { image: uploadedFile.url },
        { new: true }
    );

    if (!uploadProduct) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(201).json({
        status: "success",
        message: "File uploaded successfully",
        data: uploadProduct,
    });
});
