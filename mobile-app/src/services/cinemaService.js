import axios from '../../api/axiosInstance';

const cinemaService = {
  // Get all cinemas with pagination and filters
  getAll: async ({ page = 1, limit = 20, cityId }) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (cityId) params.append('cityId', cityId);
    
    const response = await axios.get(`/cinemas?${params.toString()}`);
    return response.data;
  },
};

export default cinemaService;