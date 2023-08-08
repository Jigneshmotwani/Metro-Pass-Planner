const mongoose = require('mongoose');

// Schema
const TripSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  startName: {
    type: String,
  },
  endName: {
    type: String,
  },
  pass: {
    type: String,
  },
  linesTaken: {
    type: Array,
    default: [],
  },
  transferStations: {
    type: Array,
    default: [],
  },
});
const Trip = mongoose.model('trips', TripSchema);
