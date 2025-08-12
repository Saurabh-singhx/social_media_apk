import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import contactsRoutes from "./routes/contactsRoutes.js";
import { ConnectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import passport from "./lib/passport.js";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5005;
const __dirname = path.resolve();

// If behind a proxy (Render, Heroku etc) enable this so secure cookies work
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Ensure you have a session secret in env for production
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // only secure in prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

// CORS: allow dev frontend and production frontend
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? "https://socialmediaapk.onrender.com"
    : "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/contacts",contactsRoutes);


// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  ConnectDB();
});
