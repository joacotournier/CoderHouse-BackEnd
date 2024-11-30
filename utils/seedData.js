import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const sampleProducts = [
  {
    title: "iPhone 14 Pro",
    description: "Latest iPhone with dynamic island",
    price: 999.99,
    thumbnail: "https://example.com/iphone14.jpg",
    code: "IP14PRO",
    stock: 50,
    category: "Electronics",
    status: true,
  },
  {
    title: "MacBook Air M2",
    description: "Powerful and efficient laptop",
    price: 1299.99,
    thumbnail: "https://example.com/macbook.jpg",
    code: "MBA-M2",
    stock: 30,
    category: "Electronics",
    status: true,
  },
  {
    title: "AirPods Pro",
    description: "Noise cancelling earbuds",
    price: 249.99,
    thumbnail: "https://example.com/airpods.jpg",
    code: "APP2",
    stock: 100,
    category: "Audio",
    status: true,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await ProductModel.deleteMany({});
    await CartModel.deleteMany({});

    // Insert sample products
    const insertedProducts = await ProductModel.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products`);

    // Create a sample cart with some products
    const cart = await CartModel.create({
      products: [
        { product: insertedProducts[0]._id, quantity: 2 },
        { product: insertedProducts[1]._id, quantity: 1 },
      ],
    });
    console.log(`Created sample cart with ID: ${cart._id}`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
