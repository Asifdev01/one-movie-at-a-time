const axios = require("axios");

const TMDB_TIMEOUT = 8000;

const moodToGenreMap = {
  Happy: 35,
  Intense: 28,
  Dark: 27,
};

const getRecommendation = async (mood, time, platforms, exclude = []) => {
  try {
    const genreId = moodToGenreMap[mood];

    const discoverRes = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          with_genres: genreId,
          "vote_average.gte": 7,
          "vote_count.gte": 500,
          page: 1,
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

    // Fetch full details (with videos) for the selected movie
    try {
      const detailRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${selected.id}`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
            append_to_response: "videos",
          },
          timeout: TMDB_TIMEOUT,
        }
      );

      const data = detailRes.data;
      const trailers = data.videos?.results || [];
      let trailer =
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
      console.error("Detail fetch failed, using basic info:", detailErr.message);
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
    console.error("Dynamic TMDB error:", error.message);
    return null;
  }
};

module.exports = { getRecommendation };
