const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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
app.post('/save-data', (req, res) => {
    console.log('Received data:', req.body);
    const data = req.body;

    // Check if file exists and if headers need to be written
    const writeHeaders = !fs.existsSync(filePath);
    const values = Object.values(data).map(value => `"${value}"`).join(',') + '\n';

    if (writeHeaders) {
        // Write headers and then data
        const headers = Object.keys(data).map(key => `"${key}"`).join(',') + '\n';
        fs.writeFile(filePath, headers + values, (err) => {
            if (err) {
                console.error('Error writing to CSV file:', err);
                return res.status(500).send('Error');
            }
            console.log('Data saved successfully');
            res.send('Success');
        });
    } else {
        // Append data to existing file
        fs.appendFile(filePath, values, (err) => {
            if (err) {
                console.error('Error writing to CSV file:', err);
                return res.status(500).send('Error');
            }
            console.log('Data saved successfully');
            res.send('Success');
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
