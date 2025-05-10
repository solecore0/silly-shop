import express from "express";
import { connectToDB } from "./utils/db.js";
import { errorMiddleWare } from "./middlewares/error.js";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToRedis } from "./services/redis.js";

config({ path: "./.env" });

const port: number = Number(process.env.PORT) || 4000;
const mongoURI: string = process.env.MONGO_URI || "";
const clientURL: string = process.env.CLIENT_URL || "http://localhost:3000";

const app = express();

// CORS configuration - must be before any other middleware
const corsOptions = {
  origin: clientURL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  exposedHeaders: ["Set-Cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Api is working with /api/v1");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is up and running",
  });
});

// Connecting to database
connectToDB(mongoURI);
// Connect to Redis
connectToRedis();

// Importing Routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import statRoutes from "./routes/stats.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/admin", statRoutes);

app.use("/uploads", express.static("uploads"));

// Error Middleware
app.use(errorMiddleWare);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
