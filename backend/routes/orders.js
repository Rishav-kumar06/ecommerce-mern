import express from "express";
import { getOrders, getOrdersByUser, createOrder } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, adminOnly, getOrders);
router.get("/user/:userId", protect, getOrdersByUser);
router.post("/", protect, createOrder);

export default router;
