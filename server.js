const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/db");
const port = process.env.PORT;

connectDb();
app.use(express.json());
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/admin", require("./routes/adminRoute"));

app.listen(port, () => {
  console.log("Server running on port:", port);
});