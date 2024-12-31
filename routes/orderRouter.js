import express from "express";
import {
    protectedMiddleware,
    ownerMiddleware,
} from "../middlewares/authMiddleware.js";
import {
    allOrder,
    createOrder,
    currentOrder,
    detailOrder,
    callbackPayment
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protectedMiddleware, createOrder);
router.get("/", protectedMiddleware, ownerMiddleware, allOrder);
router.get("/:id", protectedMiddleware, ownerMiddleware, detailOrder);
router.get("/current/user", protectedMiddleware, currentOrder);

router.post("/callback/midtrans", callbackPayment);

export default router;
