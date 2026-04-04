export const APP_NAME = "ShopNest";
export const APP_TAGLINE = "Discover. Shop. Love.";

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAILS: "/product/:id",
  CART: "/cart",
  CHECKOUT: "/checkout",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  ADMIN: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name-asc", label: "Name: A-Z" },
];

export const PAYMENT_METHODS = [
  { value: "credit_card", label: "Credit Card", icon: "💳" },
  { value: "paypal", label: "PayPal", icon: "🅿️" },
  { value: "cod", label: "Cash on Delivery", icon: "💵" },
];

export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export const PRICE_RANGES = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $300", min: 100, max: 300 },
  { label: "$300 – $500", min: 300, max: 500 },
  { label: "Over $500", min: 500, max: Infinity },
];

export const LOCAL_STORAGE_KEYS = {
  USER: "shopnest_user",
  TOKEN: "shopnest_token",
  CART: "shopnest_cart",
};
