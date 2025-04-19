import Mongoose from "mongoose";

export const connectToDB = (uri: string) => {
  if (!uri) {
    console.error("Error: MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  Mongoose.connect(uri, {
    dbName: "sillyshop",
  })
    .then((c) => {
      console.log("Database Successfully Connected to " + c.connection.host);
    })
    .catch((error) => {
      console.error("MongoDB connection error:", {
        message: error.message,
        stack: error.stack,
      });
      process.exit(1);
    });

  // Handle other MongoDB connection events
  Mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

  Mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
  });

  // Handle process termination
  process.on("SIGINT", async () => {
    try {
      await Mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    } catch (error) {
      console.error("Error during connection closure:", error);
      process.exit(1);
    }
  });
};
