import express from "express";
import {config} from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import assetRoutes from "./routes/assets.route.js";
import cors from "cors";

config();
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLWARES
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

app.use(cors({
  origin: "http://localhost:8081",  // or your Expo dev URL
  credentials: true
}));

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/asset", assetRoutes);

app.listen(PORT, ()=> {
    console.log("Server running @ Port " + PORT);
    connectDB();
});