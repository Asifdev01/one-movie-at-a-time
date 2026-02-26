const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getRecommendation } = require("../services/recommendationService");
const movieCollections = require("../../data/moviecollection");

// ── In-memory cache ──────────────────────────────────────────────────────────
let collectionsCache = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// ── Helpers ──────────────────────────────────────────────────────────────────
const TMDB_TIMEOUT = 8000; // 8 s per request

async function fetchTMDBItem(id, isTVCategory) {
    const firstEndpoint = isTVCategory ? "tv" : "movie";
    const secondEndpoint = isTVCategory ? "movie" : "tv";
    const params = { api_key: process.env.TMDB_API_KEY, append_to_response: "videos" };

    try {
        return await axios.get(
            `https://api.themoviedb.org/3/${firstEndpoint}/${id}`,
            { params, timeout: TMDB_TIMEOUT }
        );
    } catch (err) {
        if (err.response?.status === 404) {
            return await axios.get(
                `https://api.themoviedb.org/3/${secondEndpoint}/${id}`,
                { params, timeout: TMDB_TIMEOUT }
            );
        }
        throw err;
    }
}

function pickTrailer(videos = []) {
    return (
        videos.find(v => v.type === "Trailer" && v.site === "YouTube") ||
        videos.find(v => v.type === "Teaser" && v.site === "YouTube") ||
        videos.find(v => v.site === "YouTube") ||
        null
    );
}

function formatItem(data) {
    const trailer = pickTrailer(data.videos?.results);
    return {
        id: data.id,
        title: data.title || data.name,
        rating: data.vote_average,
        runtime: data.runtime || (data.episode_run_time?.[0] ?? "N/A"),
        genre: data.genres?.map(g => g.name).join(", ") || "",
        poster_url: `https://image.tmdb.org/t/p/w185${data.poster_path}`,
        overview: data.overview,
        trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
    };
}

async function buildCollections() {
    // Fetch ALL categories in parallel
    const categoryEntries = await Promise.all(
        Object.entries(movieCollections).map(async ([category, ids]) => {
            const isTVCategory = /tv|series|anime|animation/i.test(category);
            const results = await Promise.allSettled(
                ids.map(id => fetchTMDBItem(id, isTVCategory))
            );
            const movies = results
                .filter(r => r.status === "fulfilled")
                .map(r => formatItem(r.value.data));
            return [category, movies];
        })
    );
    return Object.fromEntries(categoryEntries);
}

// ── Routes ───────────────────────────────────────────────────────────────────

router.post("/recommend", async (req, res) => {
    try {
        const { mood, time, platforms, exclude, genres } = req.body;
        if (!mood || !time || !platforms) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const movie = await getRecommendation(
            mood, time, platforms,
            exclude || [],
            Array.isArray(genres) ? genres : []
        );
        if (!movie) return res.status(404).json({ message: "No movie found" });
        res.json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/movie-collections", async (req, res) => {
    try {
        const now = Date.now();

        // Serve from cache if fresh
        if (collectionsCache && (now - cacheTimestamp) < CACHE_TTL_MS) {
            console.log("[Collections] Serving from cache ⚡");
            return res.json(collectionsCache);
        }

        console.log("[Collections] Fetching fresh data from TMDB...");
        collectionsCache = await buildCollections();
        cacheTimestamp = Date.now();

        res.json(collectionsCache);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching developer picks" });
    }
});

// Warm-up endpoint – called by the app on launch to wake Render from sleep
router.get("/ping", (_req, res) => res.json({ ok: true }));

// Search TMDB for movies/TV by title
router.get("/search", async (req, res) => {
    const query = (req.query.q || "").toString().trim();
    if (!query) return res.status(400).json({ message: "Query is required" });

    try {
        // Search for both movies and TV shows
        const [moviesRes, tvRes] = await Promise.allSettled([
            axios.get("https://api.themoviedb.org/3/search/movie", {
                params: { api_key: process.env.TMDB_API_KEY, query, language: "en-US", page: 1 },
                timeout: TMDB_TIMEOUT,
            }),
            axios.get("https://api.themoviedb.org/3/search/tv", {
                params: { api_key: process.env.TMDB_API_KEY, query, language: "en-US", page: 1 },
                timeout: TMDB_TIMEOUT,
            }),
        ]);

        const movieResults = moviesRes.status === "fulfilled"
            ? moviesRes.value.data.results.filter(m => m.poster_path).slice(0, 8)
            : [];
        const tvResults = tvRes.status === "fulfilled"
            ? tvRes.value.data.results.filter(m => m.poster_path).slice(0, 4)
            : [];

        const combined = [...movieResults, ...tvResults];
        if (combined.length === 0) return res.json([]);

        // Fetch detailed info (genres + trailer) for each result in parallel
        const detailed = await Promise.allSettled(
            combined.map(item => {
                const type = item.title ? "movie" : "tv";
                return axios.get(`https://api.themoviedb.org/3/${type}/${item.id}`, {
                    params: { api_key: process.env.TMDB_API_KEY, append_to_response: "videos" },
                    timeout: TMDB_TIMEOUT,
                });
            })
        );

        const results = detailed
            .filter(r => r.status === "fulfilled")
            .map(r => formatItem(r.value.data));

        res.json(results);
    } catch (err) {
        console.error("[Search] Error:", err.message);
        res.status(500).json({ message: "Search failed" });
    }
});

module.exports = router;
