const pool = require("./index");

const createTables = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        mood_tag VARCHAR(100),
        runtime INT,
        rating FLOAT,
        year INT,
        language VARCHAR(100)
      );
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS movie_platforms (
        id SERIAL PRIMARY KEY,
        movie_idb INT REFERENCES movies(id) ON DELETE CASCADE,
        platform_name VARCHAR(100)
      );
    `);

        console.log("Tables created successfully ✅");
    } catch (error) {
        console.error("Error creating tables ❌", error);
    }
};

module.exports = createTables;
