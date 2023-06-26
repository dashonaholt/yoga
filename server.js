const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

//Middleware (for every request)
app.use(express.json()); //looks for a request body, and turns it into 'req.body'
app.use(morgan("dev"));

//Routes (go here)
app.use("/stretches", require("./routes/stretchRouter.js"));

//connect to MongoDB
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to the DB");
    // Start the Express server
    // app.listen(PORT, () => {
    //   console.log(`Server is running on port ${PORT}`);
    // });
  })
  .catch((error) => {
    console.error("Failed to connect to the DB:", error);
  });

app.use(express.static(path.join(__dirname, "client", "dist")));

// Error handler
app.use((err, req, res, next) => {
  console.log(err);
  return res.send({ errMsg: err.message });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

//Server Listen
app.listen(9000, () => {
  console.log("The server is running on Port 9000");
});
