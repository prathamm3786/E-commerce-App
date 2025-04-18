import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js"
import job from "./cron/cron.js";
import job_frontend from "./cron/cron-frontend.js";
import job_admin from "./cron/cron-admin.js";

//App config
const app = express();
const port = process.env.PORT || 5000;
connectDB();
connectCloudinary();
job.start();
job_frontend.start();
job_admin.start();

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//api endpoints
app.get("/", (req, res) => {
  res.send("API is working");
});
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.listen(port, () =>
  console.log(`server is running on http://localhost:${port}`)
);
