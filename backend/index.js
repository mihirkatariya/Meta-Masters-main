import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import eventRoutes from "./src/routes/event.js";
import checklistRoutes from "./src/routes/checklist.js";
import authRoutes from "./src/routes/auth.js";
import { connectToDB } from "./src/utils/db.js";
const PORT = process.env.PORT || 3000;

config();

const app = express();

app.use(
  cors({
    origin: "https://packpall.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(json());

// Establish database connection *once* when server starts
connectToDB()
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection failed:", err));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/checklists", checklistRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Serverless!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
