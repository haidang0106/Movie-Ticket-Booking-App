import axios from '../../api/axiosInstance';

const movieService = {
  // Get all movies with pagination and filters
  getAll: async ({ page = 1, limit = 20, genre, language }) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (genre) params.append('genre', genre);
    if (language) params.append('language', language);
    
    const response = await axios.get(`/movies?${params.toString()}`);
    return response.data;
  },

  // Get featured movies
  getFeatured: async () => {
    const response = await axios.get('/movies/featured');
    return response.data;
  },

  // Search movies
  searchMovies: async (query) => {
    const response = await axios.get(`/movies/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get movie by ID
  getById: async (movieId) => {
    const response = await axios.get(`/movies/${movieId}`);
    return response.data;
  },

  // Get shows by movie
  getShowsByMovie: async (movieId) => {
    const response = await axios.get(`/movies/${movieId}/shows`);
    return response.data;
  },

  // Toggle like movie
  toggleLike: async (movieId, customerId) => {
    const response = await axios.post(`/movies/${movieId}/like`, { customerId });
    return response.data.liked;
  },
};

export default movieService;