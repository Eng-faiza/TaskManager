require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const taskRoutes = require("./routes/taskRoute");
const reportRoutes = require("./routes/reportRoutes");
const app = express();


// middlewares
app.use(cors({
    origin:process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// conncet to database
 connectDB();

 

// middleware to parse JSON data
app.use(express.json());



// routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);   
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

//serve uploads folder // displays image 
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

// // Serve frontend build files (Vite)
// app.use(express.static(path.join(__dirname, "dist"))); // ✅ Update

// // Catch-all route: always return index.html for SPA routes
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "dist", "index.html")); // ✅ Update
// });


// start server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});