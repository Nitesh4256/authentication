import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

const port = process.env.PORT || 4000;

const allowedOrigins = [
  `http://localhost:5173`,
  // "https://authentication-frontend-i3lf.onrender.com",
  "https://authentication-2494.onrender.com",
];
// app.use(express.json());
app.use(cookieParser());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(
  cors({
    origin: allowedOrigins, // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// app.use(cors());
connectDB();
app.get("/", (req, res) => {
  res.send("hello from the server");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.listen(port, () => {
  console.log("server is listning on port 4000");
});
