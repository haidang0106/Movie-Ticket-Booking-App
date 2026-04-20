import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cinemaService from '../../services/cinemaService';

// Async thunks
export const fetchCinemas = createAsyncThunk(
  'cinema/fetchCinemas',
  async ({ page = 1, limit = 20, cityId }, { rejectWithValue }) => {
    try {
      const response = await cinemaService.getAll({ page, limit, cityId });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  cinemas: [],
  loading: false,
  error: null,
};

// Cinema slice
const cinemaSlice = createSlice({
  name: 'cinema',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cinemas
      .addCase(fetchCinemas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCinemas.fulfilled, (state, action) => {
        state.loading = false;
        state.cinemas = action.payload.cinemas || [];
      })
      .addCase(fetchCinemas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default cinemaSlice.reducer;