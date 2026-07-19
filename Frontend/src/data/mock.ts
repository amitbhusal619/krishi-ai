export const products = [
  { id: 1, name: "Fresh Tomato", farmer: "Ram Bahadur", location: "Nepalgunj", price: 68, unit: "kg", rating: 4.8, image: "🍅" },
  { id: 2, name: "Organic Maize", farmer: "Sita Thapa", location: "Butwal", price: 42, unit: "kg", rating: 4.6, image: "🌽" },
  { id: 3, name: "Basmati Rice", farmer: "Krishna Oli", location: "Chitwan", price: 120, unit: "kg", rating: 4.9, image: "🌾" },
  { id: 4, name: "Farm Potato", farmer: "Gita Rai", location: "Kaski", price: 35, unit: "kg", rating: 4.5, image: "🥔" },
  { id: 5, name: "Green Chili", farmer: "Hari Gurung", location: "Dang", price: 90, unit: "kg", rating: 4.7, image: "🌶️" },
  { id: 6, name: "Cauliflower", farmer: "Maya Karki", location: "Banke", price: 55, unit: "kg", rating: 4.4, image: "🥦" },
];

export const trendingPrices = [
  { crop: "Tomato", price: 68, change: 4.2 },
  { crop: "Maize", price: 42, change: -1.1 },
  { crop: "Rice", price: 120, change: 0.8 },
  { crop: "Potato", price: 35, change: 2.5 },
];

export const priceHistory = [
  { day: "Mon", actual: 60, predicted: 61 },
  { day: "Tue", actual: 63, predicted: 62 },
  { day: "Wed", actual: 61, predicted: 64 },
  { day: "Thu", actual: 65, predicted: 66 },
  { day: "Fri", actual: 68, predicted: 68 },
  { day: "Sat", actual: null, predicted: 71 },
  { day: "Sun", actual: null, predicted: 74 },
];

export const testimonials = [
  { name: "Ram Bahadur", role: "Tomato Farmer, Nepalgunj", quote: "I sold my whole harvest in two days and got a fair price for the first time." },
  { name: "Sita Thapa", role: "Maize Farmer, Butwal", quote: "The disease detection saved my field. I treated the blight before it spread." },
  { name: "Krishna Oli", role: "Rice Farmer, Chitwan", quote: "The price prediction told me exactly when to sell. My income went up 20%." },
];

export const farmerOrders = [
  { id: "ORD-1042", buyer: "Anish Sharma", crop: "Tomato", qty: "40kg", amount: 2720, status: "Delivered" },
  { id: "ORD-1041", buyer: "Puja Lama", crop: "Maize", qty: "80kg", amount: 3360, status: "In Transit" },
  { id: "ORD-1040", buyer: "Bikash KC", crop: "Rice", qty: "20kg", amount: 2400, status: "Pending" },
  { id: "ORD-1039", buyer: "Nisha Adhikari", crop: "Chili", qty: "10kg", amount: 900, status: "Delivered" },
];

export const revenueData = [
  { month: "Jan", revenue: 18000 },
  { month: "Feb", revenue: 22000 },
  { month: "Mar", revenue: 19500 },
  { month: "Apr", revenue: 26000 },
  { month: "May", revenue: 31000 },
  { month: "Jun", revenue: 28500 },
];

export const adminUsers = [
  { id: 1, name: "Ram Bahadur", role: "Farmer", status: "Active", joined: "Jan 2026" },
  { id: 2, name: "Anish Sharma", role: "Buyer", status: "Active", joined: "Feb 2026" },
  { id: 3, name: "Sita Thapa", role: "Farmer", status: "Pending", joined: "Mar 2026" },
  { id: 4, name: "Puja Lama", role: "Buyer", status: "Suspended", joined: "Mar 2026" },
];
