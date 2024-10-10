const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/db");
const port = process.env.PORT;

// Connect to the database
connectDb();

// Parse JSON request bodies
app.use(express.json());

app.use("/api/user", require("./routes/userRoute")); // User routes
app.use("/api/admin", require("./routes/adminRoute")); // Admin routes

app.listen(port, () => {
  console.log("Server running on port:", port);
});
