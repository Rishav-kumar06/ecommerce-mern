import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json({ data: orders, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId });
    res.json({ data: orders, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const data = req.body;
    const orderCount = await Order.countDocuments();
    const orderId = `ORD-${String(orderCount + 1).padStart(3, "0")}`;
    const order = await Order.create({
      ...data,
      id: orderId,
      user: req.user?._id,
      status: data.status || "pending",
      createdAt: data.createdAt || new Date(),
    });
    res.status(201).json({ data: order, success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
