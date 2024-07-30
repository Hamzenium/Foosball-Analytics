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
};

const drawPoints = () => {
    // Define colors for different pairs of points
    const colors = ['red', 'blue', 'green'];

    points.forEach((point, index) => {
        // Select color based on index
        const color = colors[Math.floor(index / 2) % colors.length];
        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
};


canvas.addEventListener('click', (event) => {
    if (points.length < 6) {
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
        'Foosball Start X': points[0]?.x || '',
        'Foosball Start Y': points[0]?.y || '',
        'Foosball End X': points[1]?.x || '',
        'Foosball End Y': points[1]?.y || '',
        'Goalkeeper Start X': points[2]?.x || '',
        'Goalkeeper Start Y': points[2]?.y || '',
        'Goalkeeper Start 2 X': points[3]?.x || '',
        'Goalkeeper Start 2 Y': points[3]?.y || '',
        'Goalkeeper End 1 X': points[4]?.x || '',
        'Goalkeeper End 1 Y': points[4]?.y || '',
        'Extra Point End 2 X': points[5]?.x || '',
        'Extra Point End 2 Y': points[5]?.y || '',
        'Scored': scoringStatus ? 'Yes' : 'No'
    };

    fetch('https://foosball-ai-c97c13f1b078.herokuapp.com/save-data', {
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
