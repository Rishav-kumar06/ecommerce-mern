import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json({ data: products, success: true });
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id) || await Product.findOne({ slug: id });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ data: product, success: true });
};

export const createProduct = async (req, res) => {
  const data = req.body;
  const product = await Product.create(data);
  res.status(201).json({ data: product, success: true });
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const product = await Product.findByIdAndUpdate(id, updates, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ data: product, success: true });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ success: true });
};
