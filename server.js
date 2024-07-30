const fs = require('fs');
const path = require('path');
const cors = require('cors');
const credentials = require('./key.json');
const express = require('express');
const app = express();
const admin = require('firebase-admin');
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
admin.initializeApp({
	credential: admin.credential.cert(credentials)
});
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const db = admin.firestore();

// Ensure the data directory exists
const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'foosball_data.csv');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle POST requests to /save-data
app.post('/save-data', async (req, res) => {
    console.log('Received data:', req.body);
    const data = req.body;

    try {
        // Create a new document with a unique ID in the 'foosball-data' collection
        await db.collection('foosball-data').add(data);
        console.log('Data saved successfully');
        res.send('Success');
    } catch (error) {
        console.error('Error saving data to Firestore:', error);
        res.status(500).send('Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
