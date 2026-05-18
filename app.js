const button = document.getElementById("generateBtn");
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

button.addEventListener("click", generateMap);

function generateMap() {

    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw random squares
    for (let i = 0; i < 20; i++) {

        const x = Math.random() * 700;
        const y = Math.random() * 500;

        ctx.fillStyle = randomColor();
        ctx.fillRect(x, y, 50, 50);
    }
}

function randomColor() {

    const colors = [
        "green",
        "blue",
        "tan",
        "gray"
    ];

    return colors[Math.floor(Math.random() * colors.length)];
}