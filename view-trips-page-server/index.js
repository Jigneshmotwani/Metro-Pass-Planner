const mongoose = require('mongoose');

// Connect to the MongoDB database
mongoose
  .connect('mongodb://root:rootpassword@165.22.248.255:27017/', {
    dbName: 'savedtrips',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to savedtrips database');
  })
  .catch((err) => {
    console.error('Error connecting to savedtrips database:', err);
  });

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

// For backend and express
const express = require('express');
const app = express();
const cors = require('cors');
console.log('App listen at port 5000');
app.use(express.json());
app.use(cors());
app.get('/', (req, resp) => {
  resp.send('App is Working');
});

app.get('/trips', async (req, resp) => {
  try {
    const trips = await Trip.find();
    resp.send(trips);
  } catch (e) {
    resp.status(500).send('Error retrieving trips');
  }
});

app.listen(5000);