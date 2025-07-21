import { config } from "dotenv";
import connectDB from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    email:"ender@example.com",
    fullName:" Endermen AI ",
    password: "Ender@123",
    profilePic: "https://res.cloudinary.com/dd2bqjaxn/image/upload/v1753086757/endermen_hx2eio.jpg"
  },
  {
    email: "priya.sharma@example.com",
    fullName: "Priya Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    email: "ananya.verma@example.com",
    fullName: "Ananya Verma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    email: "isha.patel@example.com",
    fullName: "Isha Patel",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/23.jpg",
  },
  {
    email: "riya.mehta@example.com",
    fullName: "Riya Mehta",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/24.jpg",
  },
  {
    email: "sneha.iyer@example.com",
    fullName: "Sneha Iyer",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/25.jpg",
  },
  {
    email: "kriti.banerjee@example.com",
    fullName: "Kriti Banerjee",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/26.jpg",
  },
  {
    email: "tanya.mukherjee@example.com",
    fullName: "Tanya Mukherjee",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/27.jpg",
  },
  {
    email: "deepa.rathore@example.com",
    fullName: "Deepa Rathore",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/28.jpg",
  },

  // Male Users
  {
    email: "rahul.singh@example.com",
    fullName: "Rahul Singh",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/21.jpg",
  },
  {
    email: "arjun.kumar@example.com",
    fullName: "Arjun Kumar",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    email: "rohit.shah@example.com",
    fullName: "Rohit Shah",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/23.jpg",
  },
  {
    email: "vivek.nair@example.com",
    fullName: "Vivek Nair",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/24.jpg",
  },
  {
    email: "siddharth.reddy@example.com",
    fullName: "Siddharth Reddy",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/25.jpg",
  },
  {
    email: "abhishek.pandey@example.com",
    fullName: "Abhishek Pandey",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/26.jpg",
  },
  {
    email: "karthik.rao@example.com",
    fullName: "Karthik Rao",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/27.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
