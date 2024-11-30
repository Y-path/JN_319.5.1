import express from "express";
import mongoose from "mongoose";
import grades from "./routes/grades.mjs";
const PORT = 5050;
const app = express();

app.use(express.json());

// Connect to Mongoose.
// Note you must specify the database you want to connect to.
// This defaults to the "test" database.
await mongoose.connect(process.env.ATLAS_URI);

app.get("/", (req, res) => {
  res.send("Welcome to the API.");
});

app.use("/grades", grades);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
