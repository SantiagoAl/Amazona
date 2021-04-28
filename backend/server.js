import express from "express";
import data from "./data";
import dotenv from "dotenv";
import config from "./config";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import orderRoute from "./routes/orderRoute";

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.Port || 5000;

const mongodbUrl = process.env.MONGODB_URL;
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongodDB database connection established successfully");
});

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);

app.listen(port, () => {
  console.log("Server started on port: 5000");
});
