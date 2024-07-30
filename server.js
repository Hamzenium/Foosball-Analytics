const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.static('public'));

app.post('/save-data', (req, res) => {
    console.log('Received data:', req.body); 
    const data = req.body;
    const filePath = path.join(__dirname, 'data', 'foosball_data.csv');
    
    if (!fs.existsSync(filePath)) {
        const headers = Object.keys(data).join(',') + '\n';
        fs.writeFileSync(filePath, headers);
    }
    
    const values = Object.values(data).join(',') + '\n';
    fs.appendFile(filePath, values, (err) => {
        if (err) {
            console.error('Error writing to CSV file:', err);
            res.status(500).send('Error');
        } else {
            console.log('Data saved successfully'); // Log success
            res.send('Success');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
