import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import movieService from '../../services/movieService';

// Async thunks
export const fetchMovies = createAsyncThunk(
  'movie/fetchMovies',
  async ({ page = 1, limit = 20, genre, language }, { rejectWithValue }) => {
    try {
      const response = await movieService.getAll({ page, limit, genre, language });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFeaturedMovies = createAsyncThunk(
  'movie/fetchFeaturedMovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await movieService.getFeatured();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchMovies = createAsyncThunk(
  'movie/searchMovies',
  async (query, { rejectWithValue }) => {
    try {
      const response = await movieService.searchMovies(query);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMovieById = createAsyncThunk(
  'movie/fetchMovieById',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await movieService.getById(movieId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchShowsByMovie = createAsyncThunk(
  'movie/fetchShowsByMovie',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await movieService.getShowsByMovie(movieId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleLikeMovie = createAsyncThunk(
  'movie/toggleLikeMovie',
  async ({ movieId, customerId }, { rejectWithValue }) => {
    try {
      const response = await movieService.toggleLike(movieId, customerId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  movies: [],
  featuredMovies: [],
  movie: null,
  shows: [],
  loading: false,
  error: null,
  liked: false,
};

// Movie slice
const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    clearMovie: (state) => {
      state.movie = null;
      state.shows = [];
      state.liked = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies || [];
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Fetch featured movies
      .addCase(fetchFeaturedMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredMovies = action.payload.movies || [];
      })
      .addCase(fetchFeaturedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Search movies
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies || [];
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Fetch movie by ID
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.movie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Fetch shows by movie
      .addCase(fetchShowsByMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShowsByMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload || [];
      })
      .addCase(fetchShowsByMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Toggle like movie
      .addCase(toggleLikeMovie.fulfilled, (state, action) => {
        state.liked = action.payload;
      });
  },
});

export const { clearMovie } = movieSlice.actions;
export default movieSlice.reducer;