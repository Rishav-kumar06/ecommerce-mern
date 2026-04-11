import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs";

dotenv.config();

const categories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    icon: "💻",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
    description: "Phones, laptops, audio and smart devices",
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "Fashion",
    slug: "fashion",
    icon: "👗",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
    description: "Trending outfits and accessories",
    color: "#ec4899",
  },
  {
    id: 3,
    name: "Sports",
    slug: "sports",
    icon: "🏋️",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
    description: "Performance gear and active lifestyle essentials",
    color: "#f97316",
  },
  {
    id: 4,
    name: "Beauty",
    slug: "beauty",
    icon: "✨",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    description: "Skincare, haircare, and beauty must-haves",
    color: "#a855f7",
  },
  {
    id: 5,
    name: "Home",
    slug: "home",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80",
    description: "Essentials for modern living",
    color: "#10b981",
  },
];

const products = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    category: "electronics",
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    rating: 4.6,
    reviewCount: 1203,
    stock: 34,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    description: "Immersive audio, long battery life, and all-day comfort.",
    features: ["ANC", "Bluetooth 5.3", "30h battery"],
    brand: "SoundMax",
    tags: ["audio", "headphones"],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    category: "electronics",
    price: 89.0,
    originalPrice: 119.0,
    discount: 25,
    rating: 4.4,
    reviewCount: 860,
    stock: 52,
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80"],
    description: "Track health metrics, workouts, and notifications.",
    features: ["Heart-rate", "GPS", "Water resistant"],
    brand: "PulseFit",
    tags: ["wearable", "fitness"],
    isFeatured: true,
    isTrending: false,
  },
  {
    id: 3,
    name: "Minimalist Cotton Hoodie",
    slug: "minimalist-cotton-hoodie",
    category: "fashion",
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    rating: 4.3,
    reviewCount: 410,
    stock: 78,
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"],
    description: "Soft, breathable cotton hoodie for everyday wear.",
    features: ["100% cotton", "Relaxed fit", "Machine washable"],
    brand: "UrbanEase",
    tags: ["hoodie", "casual"],
    isFeatured: false,
    isTrending: true,
  },
  {
    id: 4,
    name: "Ceramic Table Lamp",
    slug: "ceramic-table-lamp",
    category: "home",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.5,
    reviewCount: 221,
    stock: 25,
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"],
    description: "Warm ambient light with a clean, modern silhouette.",
    features: ["LED compatible", "Ceramic base", "Warm light"],
    brand: "NordicNest",
    tags: ["lighting", "decor"],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 5,
    name: "4K Ultra HD Smart TV 55-inch",
    slug: "4k-ultra-hd-smart-tv-55-inch",
    category: "electronics",
    price: 499.99,
    originalPrice: 649.99,
    discount: 23,
    rating: 4.7,
    reviewCount: 1542,
    stock: 19,
    images: ["https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80"],
    description: "Crystal clear visuals with built-in streaming apps.",
    features: ["4K HDR", "Dolby Audio", "Smart apps"],
    brand: "VisionPro",
    tags: ["tv", "entertainment"],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 6,
    name: "Wireless Mechanical Keyboard",
    slug: "wireless-mechanical-keyboard",
    category: "electronics",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    rating: 4.5,
    reviewCount: 688,
    stock: 47,
    images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80"],
    description: "Tactile switches with long battery life and RGB effects.",
    features: ["Hot-swappable", "RGB", "Bluetooth"],
    brand: "TypeForge",
    tags: ["keyboard", "gaming"],
    isFeatured: true,
    isTrending: false,
  },
  {
    id: 7,
    name: "Slim Fit Denim Jacket",
    slug: "slim-fit-denim-jacket",
    category: "fashion",
    price: 64.99,
    originalPrice: 84.99,
    discount: 24,
    rating: 4.2,
    reviewCount: 320,
    stock: 41,
    images: ["https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&q=80"],
    description: "Classic denim with a modern slim silhouette.",
    features: ["Stretch fabric", "Button closure", "All-season"],
    brand: "ThreadCraft",
    tags: ["jacket", "denim"],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 8,
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    category: "fashion",
    price: 54.5,
    originalPrice: 69.5,
    discount: 22,
    rating: 4.4,
    reviewCount: 275,
    stock: 33,
    images: ["https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80"],
    description: "Compact and stylish everyday carry bag.",
    features: ["Genuine leather", "Adjustable strap", "Zip pockets"],
    brand: "ModeLine",
    tags: ["bag", "accessory"],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 9,
    name: "Training Running Shoes",
    slug: "training-running-shoes",
    category: "sports",
    price: 95.0,
    originalPrice: 120.0,
    discount: 21,
    rating: 4.6,
    reviewCount: 911,
    stock: 56,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
    description: "Lightweight cushioning for daily training and runs.",
    features: ["Breathable mesh", "Foam sole", "Grip outsole"],
    brand: "RunPeak",
    tags: ["shoes", "running"],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 10,
    name: "Adjustable Dumbbell Set",
    slug: "adjustable-dumbbell-set",
    category: "sports",
    price: 129.99,
    originalPrice: 169.99,
    discount: 24,
    rating: 4.7,
    reviewCount: 504,
    stock: 22,
    images: ["https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&q=80"],
    description: "Space-saving dumbbells for effective home workouts.",
    features: ["2.5-25kg range", "Quick-lock", "Compact stand"],
    brand: "IronCore",
    tags: ["gym", "strength"],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 11,
    name: "Hydrating Face Serum",
    slug: "hydrating-face-serum",
    category: "beauty",
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
    rating: 4.5,
    reviewCount: 640,
    stock: 70,
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80"],
    description: "Lightweight serum for glowing, hydrated skin.",
    features: ["Hyaluronic acid", "Fragrance-free", "Daily use"],
    brand: "PureGlow",
    tags: ["skincare", "serum"],
    isFeatured: true,
    isTrending: false,
  },
  {
    id: 12,
    name: "Matte Lipstick Set",
    slug: "matte-lipstick-set",
    category: "beauty",
    price: 29.0,
    originalPrice: 39.0,
    discount: 26,
    rating: 4.3,
    reviewCount: 356,
    stock: 85,
    images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"],
    description: "Long-lasting matte colors for every occasion.",
    features: ["6 shades", "Smudge-resistant", "Vegan"],
    brand: "VelvetHue",
    tags: ["makeup", "lipstick"],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 13,
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    category: "home",
    price: 189.99,
    originalPrice: 249.99,
    discount: 24,
    rating: 4.6,
    reviewCount: 431,
    stock: 18,
    images: ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80"],
    description: "Supportive chair with adjustable lumbar and armrests.",
    features: ["Lumbar support", "Breathable mesh", "Tilt lock"],
    brand: "WorkEase",
    tags: ["office", "furniture"],
    isFeatured: false,
    isTrending: true,
  },
  {
    id: 14,
    name: "Non-Stick Cookware Set",
    slug: "non-stick-cookware-set",
    category: "home",
    price: 109.99,
    originalPrice: 149.99,
    discount: 27,
    rating: 4.4,
    reviewCount: 289,
    stock: 38,
    images: ["https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=800&q=80"],
    description: "Durable cookware set for easy everyday cooking.",
    features: ["PFOA-free", "Induction ready", "Dishwasher safe"],
    brand: "KitchenGlow",
    tags: ["cookware", "kitchen"],
    isFeatured: false,
    isTrending: true,
  },
  {
    id: 15,
    name: "Bluetooth Portable Speaker",
    slug: "bluetooth-portable-speaker",
    category: "electronics",
    price: 45.99,
    originalPrice: 59.99,
    discount: 23,
    rating: 4.5,
    reviewCount: 777,
    stock: 60,
    images: ["https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80"],
    description: "Portable sound with deep bass and water resistance.",
    features: ["IPX7", "12h battery", "Stereo pairing"],
    brand: "BeatBox",
    tags: ["speaker", "audio"],
    isFeatured: false,
    isTrending: true,
  },
  {
    id: 16,
    name: "Casual Sneakers",
    slug: "casual-sneakers",
    category: "fashion",
    price: 49.99,
    originalPrice: 69.99,
    discount: 29,
    rating: 4.2,
    reviewCount: 344,
    stock: 50,
    images: ["https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80"],
    description: "Everyday comfort sneakers with modern styling.",
    features: ["Cushioned sole", "Lightweight", "Breathable"],
    brand: "StreetStep",
    tags: ["sneakers", "casual"],
    isFeatured: false,
    isTrending: true,
  },
  {
    id: 17,
    name: "Yoga Mat Pro",
    slug: "yoga-mat-pro",
    category: "sports",
    price: 34.99,
    originalPrice: 44.99,
    discount: 22,
    rating: 4.7,
    reviewCount: 512,
    stock: 66,
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"],
    description: "High-grip yoga mat for studio and home practice.",
    features: ["Non-slip", "Eco TPE", "6mm cushion"],
    brand: "FlexZen",
    tags: ["yoga", "fitness"],
    isFeatured: false,
    isTrending: false,
  },
  {
    id: 18,
    name: "Vitamin C Cleanser",
    slug: "vitamin-c-cleanser",
    category: "beauty",
    price: 19.99,
    originalPrice: 26.99,
    discount: 26,
    rating: 4.4,
    reviewCount: 297,
    stock: 72,
    images: ["https://images.unsplash.com/photo-1556229174-5e42a09e45af?w=800&q=80"],
    description: "Gentle face cleanser with brightening vitamin C.",
    features: ["Sulfate-free", "Daily cleanser", "Brightening"],
    brand: "BloomSkin",
    tags: ["cleanser", "skincare"],
    isFeatured: false,
    isTrending: false,
  },
  {
    id: 19,
    name: "Smart Air Purifier",
    slug: "smart-air-purifier",
    category: "home",
    price: 139.99,
    originalPrice: 179.99,
    discount: 22,
    rating: 4.5,
    reviewCount: 198,
    stock: 27,
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"],
    description: "Quiet HEPA purifier with app controls and scheduling.",
    features: ["HEPA H13", "Wi-Fi control", "Sleep mode"],
    brand: "PureHome",
    tags: ["air", "appliance"],
    isFeatured: false,
    isTrending: false,
  },
  {
    id: 20,
    name: "Gaming Mouse RGB",
    slug: "gaming-mouse-rgb",
    category: "electronics",
    price: 39.99,
    originalPrice: 54.99,
    discount: 27,
    rating: 4.6,
    reviewCount: 875,
    stock: 63,
    images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80"],
    description: "Precision gaming mouse with customizable RGB.",
    features: ["16000 DPI", "Programmable buttons", "RGB"],
    brand: "HyperAim",
    tags: ["gaming", "mouse"],
    isFeatured: false,
    isTrending: false,
  },
];

const TARGET_PRODUCTS_PER_CATEGORY = 10;
const fallbackImageByCategory = {
  electronics: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  fashion: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
  home: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
};

let nextGeneratedId = products.length + 1;
for (const category of categories) {
  const existingCount = products.filter((p) => p.category === category.slug).length;
  const toGenerate = Math.max(0, TARGET_PRODUCTS_PER_CATEGORY - existingCount);

  for (let i = 1; i <= toGenerate; i += 1) {
    const generatedName = `${category.name} Essential ${i}`;
    const generatedSlug = `${category.slug}-essential-${i}`;
    const basePrice = 20 + i * 7 + nextGeneratedId;
    const price = Number(basePrice.toFixed(2));
    const originalPrice = Number((price * 1.25).toFixed(2));

    products.push({
      id: nextGeneratedId,
      name: generatedName,
      slug: generatedSlug,
      category: category.slug,
      price,
      originalPrice,
      discount: 20,
      rating: 4.0 + (i % 5) * 0.1,
      reviewCount: 100 + i * 23,
      stock: 25 + i * 3,
      images: [fallbackImageByCategory[category.slug]],
      description: `${generatedName} is a reliable everyday pick in ${category.name}.`,
      features: ["Top rated", "Popular choice", "Fast shipping"],
      brand: `${category.name}Co`,
      tags: [category.slug, "essentials"],
      isFeatured: i <= 3,
      isTrending: i <= 3,
    });

    nextGeneratedId += 1;
  }
}

const users = [
  {
    id: 1,
    name: "JhaHub Admin",
    email: "admin@jhahub.com",
    password: "Admin@123",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=JhaHub+Admin&background=111827&color=fff",
    joinedAt: "2026-01-01",
    isActive: true,
  },
  {
    id: 2,
    name: "Demo User",
    email: "user@jhahub.com",
    password: "User@123",
    role: "user",
    avatar: "https://ui-avatars.com/api/?name=Demo+User&background=0ea5e9&color=fff",
    joinedAt: "2026-01-10",
    isActive: true,
  },
];

const seed = async () => {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";
  await connectDB(MONGO_URI);

  console.log("Clearing existing data...");
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Order.deleteMany({});

  console.log("Importing inline seed data...");

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

  // Start with a clean orders collection for a fresh demo state.
  await Order.deleteMany({});

  console.log("Seeding complete.");
  console.log("Admin login -> email: admin@jhahub.com | password: Admin@123");
  console.log("User login  -> email: user@jhahub.com  | password: User@123");
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
