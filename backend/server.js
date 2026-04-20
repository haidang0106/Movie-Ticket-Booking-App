const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const errorHandler = require('./src/middlewares/errorHandler');
const { notFound } = require('./src/middlewares/notFound');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Movie Ticket Backend API is running!' });
});

// Import routes
const movieRoutes = require('./src/routes/movie/movie.routes');
const cinemaRoutes = require('./src/routes/cinema');
const hallRoutes = require('./src/routes/hall/hall.routes');
const showRoutes = require('./src/routes/show/show.routes');

// Use routes
app.use('/api/movies', movieRoutes);
app.use('/api/cinemas', cinemaRoutes); // Includes cinema + hall + seat routes
app.use('/api/halls', hallRoutes);     // Standalone hall routes
app.use('/api/shows', showRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;