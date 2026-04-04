import path from "path";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "../../");

const importMock = async (relativePath) => {
  const full = path.resolve(projectRoot, relativePath);
  return await import(pathToFileURL(full).href);
};

const seed = async () => {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";
  await connectDB(MONGO_URI);

  console.log("Clearing existing data...");
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Order.deleteMany({});

  console.log("Importing mock data from src/mockData...");
  const productsModule = await importMock("src/mockData/products.js");
  const categoriesModule = await importMock("src/mockData/categories.js");
  const usersModule = await importMock("src/mockData/users.js");
  const ordersModule = await importMock("src/mockData/orders.js");

  const { users } = usersModule;
  const { products } = productsModule;
  const { categories } = categoriesModule;
  const { orders } = ordersModule;

  // Insert users with hashed passwords and keep originalId
  const createdUsers = [];
  for (const u of users) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(u.password || "password", salt);
    const doc = await User.create({
      originalId: u.id,
      name: u.name,
      email: u.email,
      password: hashed,
      role: u.role || "user",
      avatar: u.avatar,
      phone: u.phone,
      address: u.address,
      joinedAt: u.joinedAt ? new Date(u.joinedAt) : new Date(),
      isActive: u.isActive ?? true,
    });
    createdUsers.push(doc);
  }

  // Insert categories
  const createdCategories = [];
  for (const c of categories) {
    const doc = await Category.create({
      originalId: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      image: c.image,
      productCount: c.productCount,
      description: c.description,
      color: c.color,
    });
    createdCategories.push(doc);
  }

  // Insert products
  const createdProducts = [];
  for (const p of products) {
    const doc = await Product.create({
      originalId: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      images: p.images,
      description: p.description,
      features: p.features,
      brand: p.brand,
      tags: p.tags,
      isFeatured: p.isFeatured,
      isTrending: p.isTrending,
    });
    createdProducts.push(doc);
  }

  // Insert orders mapping user originalId => _id and product originalId => _id
  for (const o of orders) {
    const user = createdUsers.find((uu) => uu.originalId === o.userId);
    const items = o.items.map((it) => {
      const prod = createdProducts.find((pp) => pp.originalId === it.productId);
      return {
        productId: prod ? prod._id : null,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
      };
    });
    await Order.create({
      id: o.id,
      user: user ? user._id : null,
      items,
      total: o.total,
      status: o.status,
      shippingAddress: o.shippingAddress,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
      deliveredAt: o.deliveredAt ? new Date(o.deliveredAt) : null,
    });
  }

  console.log("Seeding complete.");
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
