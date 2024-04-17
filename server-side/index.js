const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  initializeData(); // Call to function that checks and initializes data
}).catch(err => console.log('Failed to connect to MongoDB:', err));

// Data model
const DataSchema = new mongoose.Schema({
    ts: Date,               // timestamp
    machine_status: Number,
    vibration: Number
});
const Data = mongoose.model('Data', DataSchema);

// Import JSON data
const sampleData = require('/home/sunbeam/Desktop/sample-data.json'); // Adjust path as necessary

// Function to initialize data in the database
async function initializeData() {
  const count = await Data.countDocuments();
  if (count === 0) {
    await Data.insertMany(sampleData);
    console.log('Data initialized in MongoDB');
  }
}

// Routes and server setup remain the same as previous example...
app.get('/data', async (req, res) => {
    const data = await Data.find({});
    res.json(data);
  });


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
