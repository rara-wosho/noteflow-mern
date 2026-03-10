import express from "express";
import dotenv from "dotenv";
import notesRoutes from "./routes/notesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import { connectDB } from "./config/connection.js";
import ratelimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(ratelimiter);

// Routes
app.use("/api/notes", notesRoutes);
app.use("/api/users", usersRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});
