require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./src/db");
const createTables = require("./src/db/init");
const seedMovies = require("./src/db/seed");
const movieRoutes = require("./src/routes/movieRoutes");




pool.query("SELECT NOW()")
    .then(res => console.log("DB Connected:", res.rows[0]))
    .catch(err => console.error("DB Error:", err));

app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

app.use(express.json());
app.use("/api/movies", movieRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${process.env.PORT}`);
    await createTables();
    await seedMovies();
});

