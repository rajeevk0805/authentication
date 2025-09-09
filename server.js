import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/database.js";
import cloudinary from "cloudinary";

// dotenv.config({ path: "./config/.env" });

// Cloudinary configuration
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "./config/.env" });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

await connectDB();
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
