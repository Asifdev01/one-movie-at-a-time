const axios = require("axios");

const moodToGenreMap = {
  Happy: 35,
  Intense: 28,
  Dark: 27,
};

const getRecommendation = async (mood, time, platforms, exclude = []) => {
  try {
    const genreId = moodToGenreMap[mood];

    const response = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          with_genres: genreId,
          "vote_average.gte": 7,
          "vote_count.gte": 500,
          page: 1
        },
      }
    );

    let movies = response.data.results;

    if (!movies || movies.length === 0) {
      return null;
    }


    if (exclude.length > 0) {
      movies = movies.filter(movie => !exclude.includes(movie.id));
    }

    if (movies.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * movies.length);
    const selectedMovie = movies[randomIndex];

    // Fetch full details for the selected movie to get trailers and runtime
    try {
      const detailResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${selectedMovie.id}`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
            append_to_response: "videos"
          }
        }
      );

      const movieData = detailResponse.data;
      const trailers = movieData.videos?.results || [];

      // Priority: Trailer > Teaser > First YouTube Video
      let trailer = trailers.find(v => v.type === "Trailer" && v.site === "YouTube");
      if (!trailer) trailer = trailers.find(v => v.type === "Teaser" && v.site === "YouTube");
      if (!trailer) trailer = trailers.find(v => v.site === "YouTube");

      return {
        id: movieData.id,
        title: movieData.title,
        rating: movieData.vote_average,
        runtime: movieData.runtime || "N/A",
        genre: movieData.genres?.map(g => g.name).join(", ") || mood,
        poster_url: `https://image.tmdb.org/t/p/w185${movieData.poster_path}`,
        overview: movieData.overview,
        trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
      };
    } catch (detailError) {
      console.error("Error fetching movie details:", detailError.message);
      // Fallback to basic info if detail fetch fails
      return {
        id: selectedMovie.id,
        title: selectedMovie.title,
        rating: selectedMovie.vote_average,
        runtime: "N/A",
        genre: mood,
        poster_url: `https://image.tmdb.org/t/p/w185${selectedMovie.poster_path}`,
        overview: selectedMovie.overview,
        trailer_url: null
      };
    }

  } catch (error) {
    console.error("Dynamic TMDB error:", error.message);
    return null;
  }
};


module.exports = { getRecommendation };
