const express = require('express');
const router = express.Router();

const cinemaRoutes = require('./cinema.routes');
const hallRoutes = require('./hall.routes');
const seatRoutes = require('./seat.routes');

// Gộp các route con của module Cinema
router.use('/', cinemaRoutes);   // /api/cinemas/*
router.use('/', hallRoutes);     // /api/cinemas/*/halls
router.use('/', seatRoutes);     // /api/cinemas/halls/*/seats

module.exports = router;