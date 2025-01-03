import user from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendResToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const isDev = process.env.NODE_ENV === "development" ? false : true;

    const cookieOptions = {
        expire: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: isDev,
    };

    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        data: {
            user,
        },
    });
};

export const registerUser = asyncHandler(async (req, res) => {
    const isAdmin = (await user.countDocuments()) === 0;

    const role = isAdmin ? "admin" : "user";

    const createUser = await user.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: role,
    });

    createSendResToken(createUser, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400);
        throw new Error("Please provide email and password");
    }

    const userData = await user.findOne({
        email: req.body.email,
    });

    if (userData && (await userData.matchPassword(req.body.password))) {
        createSendResToken(userData, 200, res);
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const userData = await user.findById(req.user.id).select("-password");

    if (userData) {
        res.status(200).json({
            status: "success",
            data: {
                user: userData,
            },
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export const logoutUser = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });

    res.status(200).json({
        status: "success",
        message: "User logged out",
    });
};
