const canvas = document.getElementById('foosball-mat');
const ctx = canvas.getContext('2d');

let points = [];
let scoringStatus = false;

const drawBoard = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    // Draw board lines
    ctx.beginPath();
    
    // Draw equally spaced horizontal lines
    const lineSpacing = canvas.height / 5;
    for (let i = 1; i <= 4; i++) {
        const y = i * lineSpacing;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    
    // Draw vertical lines with twice the space between them
    const totalWidth = canvas.width;
    const thirdWidth = totalWidth / 3;
    const spacingBetweenLines = 2 * thirdWidth; // 2/3 of the canvas width

    // Calculate the positions of the vertical lines
    const startX = (totalWidth - spacingBetweenLines) / 2;
    const endX = startX + spacingBetweenLines;

    ctx.moveTo(startX, 0);
    ctx.lineTo(startX, canvas.height);
    ctx.moveTo(endX, 0);
    ctx.lineTo(endX, canvas.height);

    ctx.stroke();

    // Draw X and Y coordinate labels
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';

    // Draw X-axis labels
    const xInterval = canvas.width / 10;
    for (let i = 0; i <= 10; i++) {
        const x = i * xInterval;
        ctx.fillText(x.toFixed(0), x + 5, canvas.height - 5);
    }

    // Draw Y-axis labels
    const yInterval = canvas.height / 10;
    for (let i = 0; i <= 10; i++) {
        const y = i * yInterval;
        
    }
};

const drawPoints = () => {
    // Define colors for different points
    const colors = ['red', 'black', 'black', 'green', 'green', 'blue', 'blue']; // Added colors for 7 points

    points.forEach((point, index) => {
        // Select color based on index
        const color = colors[index % colors.length];
        ctx.fillStyle = color;

        // Draw square points with size 20 (4 times the current size of 5)
        const size = 20;

        ctx.beginPath();
        ctx.rect(point.x - size / 2, point.y - size / 2, size, size);
        ctx.fill();

        // Label the point coordinates
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`(${point.x.toFixed(0)}, ${point.y.toFixed(0)})`, point.x + size / 2, point.y - size / 2);
    });
};

canvas.addEventListener('click', (event) => {
    if (points.length < 7) { // Updated limit to 7 points
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        points.push({ x, y });
        drawBoard();
        drawPoints();
    }
});

document.getElementById('reset-btn').addEventListener('click', () => {
    points = [];
    drawBoard();
});

document.getElementById('export-btn').addEventListener('click', () => {
    const playerName = document.getElementById('player-name').value;
    if (!playerName) {
        alert('Please enter a player name.');
        return;
    }

    scoringStatus = document.getElementById('scored').checked;

    const singleRecord = {
        'Player Name': playerName,
        'Stick 1 X': points[0]?.x || '',
        'Stick 1 Y': points[0]?.y || '',
        'Stick 2 X': points[1]?.x || '',
        'Stick 2 Y ': points[1]?.y || '',
        'Shot X': points[2]?.x || '',
        'Shot Y': points[2]?.y || '',
        'Goalkeeper Stick 1 X Initial': points[3]?.x || '',
        'Goalkeeper Stick 1 Y Initial': points[3]?.y || '',
        'Goalkeeper Stick 2 X Initial': points[4]?.x || '',
        'Goalkeeper Stick 2 Y Initial': points[4]?.y || '',
        'Goalkeeper Stick 1 X After': points[5]?.x || '',
        'Goalkeeper Stick 1 Y After': points[5]?.y || '',
        'Goalkeeper Stick 2 X After': points[6]?.x || '', // Added Foosball Shot point
        'Goalkeeper Stick 2 Y After': points[6]?.y || '', // Added Foosball Shot point
        'Scored': scoringStatus ? 'Yes' : 'No'
    };

    fetch('https://foosball-ai-c97c13f1b078.herokuapp.com//save-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(singleRecord)
    })
    .then(response => response.text())
    .then(text => {
        if (text === 'Success') {
            alert('Data saved successfully!');
        } else {
            alert('Error saving data.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

drawBoard();
