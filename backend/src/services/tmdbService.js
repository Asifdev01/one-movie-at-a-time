const axios = require("axios");

/**
 * Fetches a movie poster URL from TMDB for a given title.
 * @param {string} title - The movie title to search for.
 * @returns {Promise<string|null>} - The full URL of the movie poster or null if not found.
 */
const getPosterFromTMDB = async (title) => {
    if (!title) {
        console.warn("[TMDB Service] No title provided for poster lookup.");
        return null;
    }

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        console.error("[TMDB Service] Missing TMDB_API_KEY in environment variables.");
        return null;
    }

    // Diagnostic: Check if general internet is reachable
    try {
        await axios.get("https://www.google.com", { timeout: 3000 });
        console.log("[TMDB Service] General internet check: SUCCESS ✅");
    } catch (e) {
        console.warn("[TMDB Service] General internet check: FAILED ❌. Check your proxy/VPN or network connection.");
    }

    // Balanced for resilience vs latency
    const MAX_RETRIES = 1;
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
        try {
            console.log(`[TMDB Service] Fetching poster for "${title}" (Attempt ${attempt})...`);

            const response = await axios.get(
                "https://api.themoviedb.org/3/search/movie",
                {
                    params: {
                        api_key: apiKey,
                        query: title,
                        include_adult: false,
                        language: "en-US",
                    },
                    timeout: 15000, // 15s per attempt
                }
            );

            const results = response.data?.results || [];
            const movie = results.find(m => m.poster_path);

            if (!movie) {
                console.log(`[TMDB Service] No poster found for: "${title}"`);
                return null;
            }

            console.log(`[TMDB Service] Successfully found poster for: "${title}" on attempt ${attempt}`);
            return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        } catch (error) {
            lastError = error;
            const status = error.response?.status;

            console.warn(`[TMDB Service] Attempt ${attempt} failed for "${title}":`, error.message);

            if (status && status >= 400 && status < 500 && status !== 429) {
                break;
            }

            if (attempt <= MAX_RETRIES) {
                await new Promise(res => setTimeout(res, 1000));
            }
        }
    }

    console.error(`[TMDB Service] All attempts failed for "${title}". Diagnostic: check your internet or if api.themoviedb.org is blocked.`);
    return null;
};

module.exports = { getPosterFromTMDB };
