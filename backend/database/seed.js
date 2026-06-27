const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const categories = [
  { name: 'Electronics' },
  { name: 'Fashion' },
  { name: 'Home & Kitchen' },
  { name: 'Sports & Outdoors' },
  { name: 'Books' },
  { name: 'Health & Beauty' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create test user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'User@123',
      role: 'user',
    });
    console.log(`👤 Test user created: ${user.email}`);

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`📁 Created ${createdCategories.length} categories`);

    // Create products
    const products = [
      {
        title: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-canceling wireless headphones with 30-hour battery life. Features advanced audio technology for crystal clear sound, comfortable over-ear design with memory foam cushions, and seamless Bluetooth 5.0 connectivity.',
        price: 149.99,
        category: createdCategories[0]._id,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 50,
        rating: 4.5,
        featured: true,
      },
      {
        title: 'Smart Watch Pro X',
        description: 'Advanced smartwatch with health monitoring, GPS tracking, and 7-day battery life. Water-resistant to 50m with AMOLED display. Track your workouts, heart rate, sleep patterns and more.',
        price: 299.99,
        category: createdCategories[0]._id,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 30,
        rating: 4.7,
        featured: true,
      },
      {
        title: 'Ultra HD 4K Camera',
        description: 'Professional-grade 4K camera with 48MP sensor, optical image stabilization, and 4K video recording at 60fps. Perfect for photography enthusiasts and content creators.',
        price: 899.99,
        category: createdCategories[0]._id,
        images: [
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 15,
        rating: 4.8,
        featured: true,
      },
      {
        title: 'Portable Bluetooth Speaker',
        description: 'Waterproof portable speaker with 360-degree sound, 20-hour playtime, and built-in microphone for hands-free calling. Perfect for outdoor adventures.',
        price: 79.99,
        category: createdCategories[0]._id,
        images: [
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 100,
        rating: 4.3,
        featured: false,
      },
      {
        title: 'Premium Leather Jacket',
        description: 'Handcrafted genuine leather jacket with quilted lining, multiple pockets, and premium hardware. Timeless design that gets better with age.',
        price: 349.99,
        category: createdCategories[1]._id,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 25,
        rating: 4.6,
        featured: true,
      },
      {
        title: 'Designer Sunglasses',
        description: 'UV400 protection polarized sunglasses with titanium frame. Lightweight, durable, and stylish design for everyday wear.',
        price: 189.99,
        category: createdCategories[1]._id,
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 40,
        rating: 4.4,
        featured: true,
      },
      {
        title: 'Classic Running Shoes',
        description: 'Lightweight running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole. Designed for comfort during long-distance runs.',
        price: 129.99,
        category: createdCategories[1]._id,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 60,
        rating: 4.5,
        featured: false,
      },
      {
        title: 'Smart Home Hub',
        description: 'Central smart home controller compatible with 100+ devices. Voice control, automation routines, and energy monitoring. Easy setup with intuitive app.',
        price: 199.99,
        category: createdCategories[2]._id,
        images: [
          'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 35,
        rating: 4.2,
        featured: true,
      },
      {
        title: 'Automatic Coffee Maker',
        description: 'Programmable coffee maker with built-in grinder, 12-cup capacity, and temperature control. Wake up to freshly brewed coffee every morning.',
        price: 249.99,
        category: createdCategories[2]._id,
        images: [
          'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 20,
        rating: 4.6,
        featured: false,
      },
      {
        title: 'Ergonomic Office Chair',
        description: 'Premium ergonomic chair with lumbar support, adjustable armrests, headrest, and breathable mesh back. Designed for all-day comfort.',
        price: 449.99,
        category: createdCategories[2]._id,
        images: [
          'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 18,
        rating: 4.7,
        featured: true,
      },
      {
        title: 'Professional Yoga Mat',
        description: 'Extra thick 6mm eco-friendly yoga mat with alignment lines, non-slip surface, and carrying strap. Perfect for yoga, pilates, and stretching.',
        price: 49.99,
        category: createdCategories[3]._id,
        images: [
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 80,
        rating: 4.4,
        featured: false,
      },
      {
        title: 'Mountain Bike Elite',
        description: 'Full suspension mountain bike with 27-speed Shimano gears, hydraulic disc brakes, and lightweight aluminum frame. Built for trail riding.',
        price: 1299.99,
        category: createdCategories[3]._id,
        images: [
          'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 8,
        rating: 4.9,
        featured: true,
      },
      {
        title: 'The Art of Programming',
        description: 'Comprehensive guide to modern software engineering practices. Covers design patterns, algorithms, clean code principles, and system architecture.',
        price: 39.99,
        category: createdCategories[4]._id,
        images: [
          'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 200,
        rating: 4.8,
        featured: false,
      },
      {
        title: 'Organic Skincare Set',
        description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer. Made with 100% organic ingredients, cruelty-free and dermatologist tested.',
        price: 89.99,
        category: createdCategories[5]._id,
        images: [
          'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 45,
        rating: 4.5,
        featured: true,
      },
      {
        title: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek minimalist design with LED indicator and anti-slip surface.',
        price: 29.99,
        category: createdCategories[0]._id,
        images: [
          'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1622445262943-d4b2e17231a2?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 150,
        rating: 4.1,
        featured: false,
      },
      {
        title: 'Stainless Steel Water Bottle',
        description: 'Double-walled vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof design.',
        price: 34.99,
        category: createdCategories[3]._id,
        images: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80'
        ],
        stock: 120,
        rating: 4.3,
        featured: false,
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`📦 Created ${createdProducts.length} products`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log(`   Admin: ${process.env.ADMIN_EMAIL || 'admin@example.com'} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    console.log('   User:  user@example.com / User@123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDB();
