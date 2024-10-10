import express from "express";
import { connectToDB } from "./utils/db.js";
import { errorMiddleWare } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

config({ path: "./.env" });

const port: number = Number(process.env.PORT) || 4000;
const mongoURI: string = process.env.MONGO_URI || "";

const app = express();

export const myCache = new NodeCache();

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Api is working with /api/v1");
});

// Connecting to database
connectToDB(mongoURI);

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
