import express from "express";
import dotenv from "dotenv";
import UserRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.send("This is the server from Sadhvi");
});

// Routes
app.use("/api/v1/user", UserRouter); // lowercase is best practice

export default app;
