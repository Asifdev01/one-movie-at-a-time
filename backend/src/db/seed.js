const pool = require("./index");

const seedMovies = async () => {
    try {
        // Check if movies already exist
        const check = await pool.query("SELECT * FROM movies LIMIT 1");

        if (check.rows.length > 0) {
            console.log("Movies already seeded ✅");
            return;
        }

        // Insert movies
        await pool.query(`
      INSERT INTO movies (title, genre, mood_tag, runtime, rating, year, language)
      VALUES
      ('Inception', 'Sci-Fi', 'Intense', 148, 8.8, 2010, 'English'),
      ('Zindagi Na Milegi Dobara', 'Drama', 'Happy', 155, 8.2, 2011, 'Hindi'),
      ('The Conjuring', 'Horror', 'Dark', 112, 7.5, 2013, 'English');
    `);

        // Insert platforms
        await pool.query(`
      INSERT INTO movie_platforms (movie_id, platform_name)
      VALUES
      (1, 'Netflix'),
      (2, 'Prime'),
      (3, 'Netflix'),
      (3, 'Prime');
    `);

        console.log("Movies seeded successfully 🎬");
    } catch (error) {
        console.error("Seeding error ❌", error);
    }
};

module.exports = seedMovies;
