import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./lib/connectDB.js";
import Home from "./models/home.model.js";

const sampleStays = [
  {
    title: "Grand Horizon Beachfront Villa",
    description: "A luxury beachside retreat featuring direct ocean access, a private infinity pool, chef service, and a beautiful tropical garden. Perfect for families or group getaways seeking total privacy.",
    location: {
      province: "Bali",
      district: "Badung",
      city: "Canggu",
      address: "Jalan Batu Bolong No. 88, Canggu, Bali",
      latitude: -8.6500,
      longitude: 115.1300,
    },
    price: 320,
    bedrooms: 4,
    bathrooms: 4,
    floorArea: 3500,
    floors: 2,
    landArea: 6000,
    parking: 2,
    features: ["Private Pool", "Beachfront Access", "Chef Service", "Ocean View", "Free Wi-Fi", "AC"],
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
    ],
    isApproved: true,
    status: "active",
    averageRating: 4.9,
    reviewsCount: 18,
  },
  {
    title: "Eiffel Tower View Studio",
    description: "A cozy, modern studio apartment situated in the heart of Paris with a stunning balcony view of the Eiffel Tower. Walking distance to premium cafes, bakeries, and metro stations.",
    location: {
      province: "Île-de-France",
      district: "Paris City",
      city: "Paris",
      address: "15 Avenue de la Bourdonnais, Paris, France",
      latitude: 48.8584,
      longitude: 2.2945,
    },
    price: 185,
    bedrooms: 1,
    bathrooms: 1,
    floorArea: 450,
    floors: 1,
    landArea: 450,
    parking: 0,
    features: ["Eiffel View Balcony", "Heating", "Coffee Machine", "Wi-Fi", "Washer", "Elevator"],
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80"
    ],
    isApproved: true,
    status: "active",
    averageRating: 4.7,
    reviewsCount: 32,
  },
  {
    title: "Zen Garden Sanctuary Townhouse",
    description: "Experience traditional Japanese architecture in this beautifully renovated townhouse, featuring authentic tatami mats, a private cypress hot tub, and a peaceful rock garden view.",
    location: {
      province: "Kyoto",
      district: "Higashiyama",
      city: "Kyoto",
      address: "32 Gionmachi Minamigawa, Kyoto, Japan",
      latitude: 35.0037,
      longitude: 135.7782,
    },
    price: 240,
    bedrooms: 2,
    bathrooms: 1.5,
    floorArea: 1200,
    floors: 2,
    landArea: 1500,
    parking: 1,
    features: ["Traditional Zen Garden", "Private Cypress Hot Tub", "Tatami Rooms", "Tea Room", "Quiet Area", "Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
    ],
    isApproved: true,
    status: "active",
    averageRating: 4.95,
    reviewsCount: 14,
  },
  {
    title: "Ocean Breeze Penthouse Condo",
    description: "Stunning modern penthouse located on the Cape Town coastline. Features an expansive private rooftop deck, BBQ grill, hot tub, and uninterrupted vistas of Table Mountain and the Atlantic.",
    location: {
      province: "Western Cape",
      district: "Cape Town",
      city: "Cape Town",
      address: "102 Beach Road, Sea Point, Cape Town",
      latitude: -33.9189,
      longitude: 18.3964,
    },
    price: 290,
    bedrooms: 3,
    bathrooms: 3,
    floorArea: 2400,
    floors: 1,
    landArea: 2400,
    parking: 2,
    features: ["Private Rooftop Deck", "BBQ Grill", "Hot Tub", "Ocean & Mountain Views", "Gym Access", "24/7 Security"],
    images: [
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    isApproved: true,
    status: "active",
    averageRating: 4.85,
    reviewsCount: 22,
  },
  {
    title: "Skyline Oasis Luxury Apartment",
    description: "An elegant, high-end apartment in Colombo's skyline. Featuring an infinity pool, fully equipped private gym access, 24/7 concierge, and close proximity to premium shopping complexes.",
    location: {
      province: "Western Province",
      district: "Colombo",
      city: "Colombo 03",
      address: "77 Galle Road, Colombo 03, Sri Lanka",
      latitude: 6.9185,
      longitude: 79.8492,
    },
    price: 150,
    bedrooms: 2,
    bathrooms: 2,
    floorArea: 1400,
    floors: 1,
    landArea: 1400,
    parking: 1,
    features: ["Rooftop Infinity Pool", "Skyline View", "Private Gym", "24/7 Concierge", "Washer/Dryer", "Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    isApproved: true,
    status: "active",
    averageRating: 4.75,
    reviewsCount: 41,
  },
  {
    title: "Cozy Mountain Log Cabin",
    description: "A rustic but fully loaded mountain cabin tucked in the cool hills of Nuwara Eliya. Features an indoor stone fireplace, scenic mountain view deck, and a serene walking path.",
    location: {
      province: "Central Province",
      district: "Nuwara Eliya",
      city: "Nuwara Eliya",
      address: "18 Moon Plains Rd, Nuwara Eliya, Sri Lanka",
      latitude: 6.9654,
      longitude: 80.7892,
    },
    price: 110,
    bedrooms: 2,
    bathrooms: 2,
    floorArea: 1100,
    floors: 1,
    landArea: 4000,
    parking: 2,
    features: ["Indoor Fireplace", "Mountain Views", "Private Wood Deck", "BBQ Grill", "Coffee Machine", "Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80"
    ],
    isApproved: true,
    status: "active",
    averageRating: 4.9,
    reviewsCount: 9,
  },
  {
    title: "Minimalist Loft Apartment",
    description: "A sleek, architect-designed studio loft in Shibuya, Tokyo. High ceilings, industrial concrete finishes, and a smart house layout. Steps away from the Shibuya Crossing and premium dining spots.",
    location: {
      province: "Tokyo Prefecture",
      district: "Shibuya City",
      city: "Tokyo",
      address: "1-22 Udagawacho, Shibuya, Tokyo, Japan",
      latitude: 35.6620,
      longitude: 139.7000,
    },
    price: 195,
    bedrooms: 1,
    bathrooms: 1,
    floorArea: 680,
    floors: 1,
    landArea: 680,
    parking: 0,
    features: ["High Ceiling Loft", "Smart House Tech", "AC & Heating", "City View", "Washer", "Pocket Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
    ],
    isApproved: true,
    status: "active",
    averageRating: 4.8,
    reviewsCount: 26,
  },
  {
    title: "Majestic Sunset Resort Villa",
    description: "A majestic oceanfront villa in Galle. Features a large infinity pool, personal butler service, fully equipped game room with a pool table, and full staff coordination. Watch stunning tropical sunsets from your terrace.",
    location: {
      province: "Southern Province",
      district: "Galle",
      city: "Galle City",
      address: "42 Lighthouse Street, Galle Fort, Galle, Sri Lanka",
      latitude: 6.0264,
      longitude: 80.2176,
    },
    price: 380,
    bedrooms: 5,
    bathrooms: 5.5,
    floorArea: 4800,
    floors: 2,
    landArea: 8000,
    parking: 3,
    features: ["Beach Front", "Large Infinity Pool", "Butler & Chef Staff", "Pool Table & Game Room", "Terrace", "Security"],
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
    ],
    isApproved: true,
    status: "active",
    averageRating: 4.97,
    reviewsCount: 15,
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    // Delete existing properties to keep it perfect and unique
    console.log("Clearing existing stays...");
    await Home.deleteMany();

    // Insert sample stays
    console.log("Seeding LuxeKey stay properties...");
    await Home.insertMany(sampleStays);
    console.log("Database seeded successfully with 8 premium stays!");

    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDB();
