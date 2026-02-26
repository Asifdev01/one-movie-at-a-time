const axios = require("axios");

const TMDB_TIMEOUT = 8000;

/**
 * Fetches a movie poster URL from TMDB for a given title.
 */
const getPosterFromTMDB = async (title) => {
    if (!title) return null;

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        console.error("[TMDB Service] Missing TMDB_API_KEY.");
        return null;
    }

    try {
        const response = await axios.get(
            "https://api.themoviedb.org/3/search/movie",
            {
                params: {
                    api_key: apiKey,
                    query: title,
                    include_adult: false,
                    language: "en-US",
                },
                timeout: TMDB_TIMEOUT,
            }
        );

        const movie = (response.data?.results || []).find(m => m.poster_path);
        if (!movie) return null;
        return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    } catch (error) {
        console.error(`[TMDB Service] Failed for "${title}":`, error.message);
        return null;
    }
};

module.exports = { getPosterFromTMDB };
