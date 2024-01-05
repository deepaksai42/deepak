const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/copiedTextDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the copied text
const copiedTextSchema = new mongoose.Schema({
  data: String, // Update to match the property name used in the fetch request
});

// Create a model based on the schema
const CopiedText = mongoose.model('CopiedText', copiedTextSchema);

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Endpoint to save the copied text to MongoDB
app.post('/saveData', async (req, res) => {
  const { data } = req.body;

  try {
    const newCopiedTextDocument = {
      data: data, // Update to match the property name used in the schema
    };

    // Save the copied text to MongoDB
    const insertResult = await CopiedText.create(newCopiedTextDocument);
    console.log('Inserted text with id:', insertResult._id);

    res.status(201).json({ id: insertResult._id, data: data }); // Update to match the property name used in the fetch request
  } catch (error) {
    console.error('Error saving text to database:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve your client-side code (replace 'public' with your actual directory)
app.use(express.static('public'));
