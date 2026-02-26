const axios = require("axios");

const TMDB_TIMEOUT = 8000;

const GENRE_TO_TMDB = {
  Happy: 35,
  Peace: 18,
  Sad: 18,
  Intense: 28,
  Action: 28,
  Dark: 27,
  Thriller: 53,
  Suspense: 9648,
  Crime: 80,
  Calm: 10751,
  Journey: 12,
};

const MOOD_FALLBACK = {
  Happy: 35,
  Sad: 18,
  Angry: 28,
  Normal: 35,
  Intense: 28,
  Dark: 27,
};

const getRecommendation = async (mood, time, platforms, exclude = [], genres = []) => {
  try {
    let tmdbGenreIds = [];
    if (genres && genres.length > 0) {
      tmdbGenreIds = [...new Set(genres.map(g => GENRE_TO_TMDB[g]).filter(Boolean))];
    }
    if (tmdbGenreIds.length === 0) {
      const fallback = MOOD_FALLBACK[mood];
      if (fallback) tmdbGenreIds = [fallback];
    }

    const discoverRes = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          with_genres: tmdbGenreIds.join("|"),
          "vote_average.gte": 7,
          "vote_count.gte": 500,
          sort_by: "popularity.desc",
          page: Math.floor(Math.random() * 3) + 1,
        },
        timeout: TMDB_TIMEOUT,
      }
    );

    let movies = discoverRes.data.results || [];
    if (movies.length === 0) return null;

    if (exclude.length > 0) {
      movies = movies.filter(m => !exclude.includes(m.id));
    }
    if (movies.length === 0) return null;

    const selected = movies[Math.floor(Math.random() * movies.length)];

    try {
      const detailRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${selected.id}`,
        {
          params: { api_key: process.env.TMDB_API_KEY, append_to_response: "videos" },
          timeout: TMDB_TIMEOUT,
        }
      );

      const data = detailRes.data;
      const trailers = data.videos?.results || [];
      const trailer =
        trailers.find(v => v.type === "Trailer" && v.site === "YouTube") ||
        trailers.find(v => v.type === "Teaser" && v.site === "YouTube") ||
        trailers.find(v => v.site === "YouTube") ||
        null;

      return {
        id: data.id,
        title: data.title,
        rating: data.vote_average,
        runtime: data.runtime || "N/A",
        genre: data.genres?.map(g => g.name).join(", ") || mood,
        poster_url: `https://image.tmdb.org/t/p/w185${data.poster_path}`,
        overview: data.overview,
        trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      };

    } catch (detailErr) {
      return {
        id: selected.id,
        title: selected.title,
        rating: selected.vote_average,
        runtime: "N/A",
        genre: mood,
        poster_url: `https://image.tmdb.org/t/p/w185${selected.poster_path}`,
        overview: selected.overview,
        trailer_url: null,
      };
    }

  } catch (error) {
    console.error("Recommendation error:", error.message);
    return null;
  }
};

module.exports = { getRecommendation };
