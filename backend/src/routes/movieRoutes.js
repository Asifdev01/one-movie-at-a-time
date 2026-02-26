const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getRecommendation } = require("../services/recommendationService");
const movieCollections = require("../../data/moviecollection");

router.post("/recommend", async (req, res) => {
    try {
        const { mood, time, platforms, exclude } = req.body;

        if (!mood || !time || !platforms) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const movie = await getRecommendation(
            mood,
            time,
            platforms,
            exclude || []
        );

        if (!movie) {
            return res.status(404).json({ message: "No movie found" });
        }

        res.json(movie);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/movie-collections", async (req, res) => {
    try {

        const collections = {};

        for (const category in movieCollections) {
            const ids = movieCollections[category];
            const isTVCategory = /tv|series|anime|animation/i.test(category);

            // Use allSettled to prevent one bad ID from crashing the whole request
            const results = await Promise.allSettled(
                ids.map(async (id) => {
                    const firstEndpoint = isTVCategory ? "tv" : "movie";
                    const secondEndpoint = isTVCategory ? "movie" : "tv";

                    try {
                        // Try the prioritized endpoint first
                        return await axios.get(`https://api.themoviedb.org/3/${firstEndpoint}/${id}`, {
                            params: { api_key: process.env.TMDB_API_KEY, append_to_response: "videos" }
                        });
                    } catch (error) {
                        if (error.response?.status === 404) {
                            // If not found, try the fallback endpoint
                            return await axios.get(`https://api.themoviedb.org/3/${secondEndpoint}/${id}`, {
                                params: { api_key: process.env.TMDB_API_KEY, append_to_response: "videos" }
                            });
                        }
                        throw error;
                    }
                })
            );

            // Filter for successful responses and map to our structure
            collections[category] = results
                .filter(res => res.status === 'fulfilled')
                .map(res => {
                    const data = res.value.data;
                    const trailers = data.videos?.results || [];

                    // Priority: Trailer > Teaser > First YouTube Video
                    let trailer = trailers.find(v => v.type === "Trailer" && v.site === "YouTube");
                    if (!trailer) trailer = trailers.find(v => v.type === "Teaser" && v.site === "YouTube");
                    if (!trailer) trailer = trailers.find(v => v.site === "YouTube");

                    return {
                        id: data.id,
                        title: data.title || data.name, // Use 'name' for TV series
                        rating: data.vote_average,
                        runtime: data.runtime || (data.episode_run_time ? data.episode_run_time[0] : "N/A"),
                        genre: data.genres.map(g => g.name).join(", "),
                        poster_url: `https://image.tmdb.org/t/p/w185${data.poster_path}`,
                        overview: data.overview,
                        trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
                    };
                });
        }

        res.json(collections);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching developer picks" });
    }
});

module.exports = router;
