const express = require("express");
const { default: mongoose } = require("mongoose");
require("dotenv/config");

const app = express();
const cors = require("cors");

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hi there server initialized')
});

// user authentication route
const userRoute = require("./routes/user");
app.use("/api/users/", userRoute);

// changed mongoose connection
mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to MongoDB');

        // Start the server
        app.listen(4000, () => console.log("Listening to port 4000"));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Define the Trip schema and model here (similar to the previous example)
const tripSchema = new mongoose.Schema({
    userID: String,
    startName: String,
    endName: String,
    pass: String,
    linesTaken: [String],
    transferStations: [String],
  });
  
const Trip = mongoose.model("Trip", tripSchema);

// Create a route to handle saving trips
app.post("/api/savetrips", async (req, res) => {
    try {
        const tripData = req.body;
        const newTrip = new Trip(tripData);
        await newTrip.save();
        res.status(200).json({ message: "Trip saved successfully!" });
    } catch (error) {
        console.error("Error saving trip:", error);
        res.status(500).json({ error: "Failed to save trip. Please try again later." });
    }
});

app.get('/api/gettrips', async (req, resp) => {
    try {
        const trips = await Trip.find();
        resp.send(trips);
    } catch (e) {
        resp.status(500).send('Error retrieving trips');
    }
});

app.delete("/api/removetrip/:id", async (req, res) => {
    const tripId = req.params.id;
  
    try {
      const deletedTrip = await Trip.findByIdAndDelete(tripId);
  
      if (!deletedTrip) {
        return res.status(404).json({ error: "Trip not found." });
      }
  
      res.status(200).json({ message: "Trip removed successfully!" });
    } catch (error) {
      console.error("Error removing trip:", error);
      res.status(500).json({ error: "Failed to remove trip. Please try again later." });
    }
});