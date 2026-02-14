// 1. Configuration & Constants
const gameArea = document.getElementById('game-area');
const typer = document.getElementById('typer');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const ship = document.getElementById('ship'); // Ensure this exists in HTML!

const wordList = ["algorithm", "function", "variable", "constant", "deployment", "terminal", "compiler", "asynchronous"];
let activeWords = [];
let score = 0;
let lives = 3;
let gameSpeed = 0.5; // Lower is slower

// 2. Spawn a New Word
function spawnWord() {
    const text = wordList[Math.floor(Math.random() * wordList.length)];
    const el = document.createElement('div');
    el.classList.add('word');
    el.innerText = text;

    // Random X position, but stay within the screen
    const xPos = Math.random() * (window.innerWidth - 150);
    el.style.left = `${xPos}px`;
    el.style.top = '0px';

    gameArea.appendChild(el);
    activeWords.push({ text: text, el: el, top: 0 });
}

// 3. The Game Loop (Movement & Logic)
function update() {
    for (let i = activeWords.length - 1; i >= 0; i--) {
        const word = activeWords[i];
        word.top += gameSpeed;
        word.el.style.top = `${word.top}px`;

        // Check for "Ground Collision"
        if (word.top > gameArea.offsetHeight) {
            lives--;
            livesEl.innerText = lives;
            word.el.remove();
            activeWords.splice(i, 1);

            if (lives <= 0) {
                alert("GAME OVER! Score: " + score);
                location.reload();
            }
        }
    }
    requestAnimationFrame(update); // Smoother than setInterval for movement
}

// 4. The Laser Effect (Based on your math)
function createLaser(targetEl) {
    const laser = document.createElement('div');
    laser.classList.add('laser');

    const shipRect = ship.getBoundingClientRect();
    const wordRect = targetEl.getBoundingClientRect();

    // Start point (Center of ship)
    const startX = shipRect.left + shipRect.width / 2;
    const startY = shipRect.top;

    // End point (Center of word)
    const endX = wordRect.left + wordRect.width / 2;
    const endY = wordRect.top + wordRect.height / 2;

    // Math for distance and angle
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    // Apply styles
    laser.style.width = `${distance}px`;
    laser.style.left = `${startX}px`;
    laser.style.top = `${startY}px`;
    laser.style.transform = `rotate(${angle}deg)`;

    document.body.appendChild(laser);

    // Fade and remove
    setTimeout(() => {
        laser.style.opacity = "0";
        setTimeout(() => laser.remove(), 100);
    }, 100);
}

// 5. Typing Listener
typer.addEventListener('input', () => {
    const userInput = typer.value.trim().toLowerCase();
    
    // Find the word that matches
    const foundIndex = activeWords.findIndex(w => w.text.toLowerCase() === userInput);

    if (foundIndex !== -1) {
        const target = activeWords[foundIndex];
        
        // Trigger Laser!
        createLaser(target.el);

        // Update Score & Clean up
        score += 10;
        scoreEl.innerText = score;
        
        // Slight delay so laser actually hits before word vanishes
        setTimeout(() => {
            target.el.remove();
            activeWords.splice(foundIndex, 1);
        }, 50);

        typer.value = ""; // Clear input
    }
});

// Start the game
update();
setInterval(spawnWord, 3000); // New word every 3 seconds