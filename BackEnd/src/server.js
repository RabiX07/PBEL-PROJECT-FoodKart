import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket.js";

import connectDB from "../src/config/DB_connect.js";
import expressFile from "express-fileupload";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import profileRoute from "./routes/profileRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import productRoute from "./routes/productRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cartRoute from "./routes/cartRoute.js";
import AdminAuthRoute from "./routes/Admin/AuthRoute.js";
import orderFetchRoute from "./routes/Admin/orderFetchRoute.js";
import adminStatsRoute from "./routes/Admin/adminStatsRoute.js";
import notificationRoute from "./routes/Notification/notificationRoute.js";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const PORT = process.env.PORT || 3000;

// --------------------------------------------------
// EXPRESS APP
// --------------------------------------------------

const app = express();

// --------------------------------------------------
// HTTP SERVER
// --------------------------------------------------

const httpServer = createServer(app);

// --------------------------------------------------
// ALLOWED ORIGINS
// --------------------------------------------------

const allowedOrigins = [
  "http://localhost:5173",
   "http://localhost:5174",
  "https://mca-1st-sem-project-user.vercel.app",
  "https://mca-1st-sem-project-shop.vercel.app"
];

// --------------------------------------------------
// SOCKET.IO
// --------------------------------------------------

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

initializeSocket(io);

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // -----------------------------------------------
    // STAFF ROOM
    // -----------------------------------------------
    socket.on("join-staff", () => {
        socket.join("staff");

        console.log(
            `Socket ${socket.id} joined staff room`
        );
    });


    // -----------------------------------------------
    // USER ROOM
    // -----------------------------------------------
    socket.on("join-user", (userId) => {
        if (!userId) return;

        const room = `user:${userId}`;

        socket.join(room);

        console.log(
            `Socket ${socket.id} joined ${room}`
        );
    });


    // -----------------------------------------------
    // DISCONNECT
    // -----------------------------------------------
    socket.on("disconnect", () => {
        console.log(
            "Socket disconnected:",
            socket.id
        );
    });
});

// --------------------------------------------------
// EXPRESS FILE UPLOAD
// --------------------------------------------------

app.use(
  expressFile({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
);

// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests that don't have an Origin
      // such as Postman/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

// --------------------------------------------------
// BODY PARSER
// --------------------------------------------------

app.use(express.json());

// --------------------------------------------------
// COOKIE PARSER
// --------------------------------------------------

app.use(cookieParser());

// --------------------------------------------------
// ROUTES
// --------------------------------------------------

app.use("/api/users", userRoute);

app.use("/api/profile", profileRoute);

app.use("/api/upload", uploadRoute);

app.use("/api/products", productRoute);

app.use("/api/orders", orderRoute);

app.use("/api/payments", paymentRoute);

app.use("/api/cart", cartRoute);

app.use("/api/admin/auth", AdminAuthRoute);

app.use("/api/admin/orders", orderFetchRoute);

app.use("/api/admin/stats", adminStatsRoute);

app.use("/api/notifications", notificationRoute);

// --------------------------------------------------
// HOME ROUTE
// --------------------------------------------------

app.get("/", (req, res) => {
  res.send("welcome to the home page");
});

// --------------------------------------------------
// DATABASE + SERVER START
// --------------------------------------------------

connectDB()
  .then(() => {
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started at http://localhost:${PORT}/`);
      console.log(`BASE API ROUTE IS http://localhost:${PORT}/api/`);
      console.log(`Socket.IO server is running`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });