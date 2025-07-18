import express from 'express';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import authRoutes from './routes/auth.route.js';
import cors from 'cors';
import messageRoutes from './routes/message.route.js';
dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 5001;
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "https://localhost:5173",
    credentials: true
}));
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})