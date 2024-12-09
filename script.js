const pogostick = document.getElementById('pogostick');
const gameContainer = document.getElementById('game-container');
const platforms = document.querySelectorAll('.platform');

let positionX = 200; // Startposition X
let positionY = 200; // Startposition Y
let velocityY = 0; // Vertikale Geschwindigkeit
let isJumping = false;
let bounceForce = -5; // Standard-Hüpfen

function isOnPlatform() {
    // Prüfen, ob der Pogostick auf einer Plattform steht
    for (const platform of platforms) {
        const platformRect = platform.getBoundingClientRect();
        const pogoRect = pogostick.getBoundingClientRect();

        if (
            pogoRect.bottom >= platformRect.top && // Unterseite des Pogosticks berührt die Plattform
            pogoRect.bottom <= platformRect.bottom + 10 && // Etwas Toleranz
            pogoRect.left < platformRect.right && // Pogostick überlappt horizontal mit der Plattform
            pogoRect.right > platformRect.left
        ) {
            return platform;
        }
    }
    return null;
}

// Bewegung mit Pfeiltasten
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            positionX -= 20;
            break;
        case 'ArrowRight':
            positionX += 20;
            break;
        case 'ArrowUp':
            if (!isJumping) {
                isJumping = true;
                velocityY = -17; // Höher springen bei Pfeiltaste
            }
            break;
    }
});

// Touch-Steuerung für Smartphones
let touchStartX = 0;
gameContainer.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
});

gameContainer.addEventListener('touchmove', (event) => {
    const touchX = event.touches[0].clientX;
    positionX += (touchX - touchStartX) / 5; // Horizontal wischen
    touchStartX = touchX;
});

// Animation des Pogosticks
function update() {
    // Schwerkraft simulieren
    velocityY += 1; // Schwerkraft
    positionY += velocityY;

    const platform = isOnPlatform();
    if (platform && velocityY > 0) {
        // Wenn auf einer Plattform gelandet, Standard-Bounce auslösen
        const platformRect = platform.getBoundingClientRect();
        positionY = platformRect.top - pogostick.offsetHeight + gameContainer.scrollTop;
        velocityY = bounceForce; // Leichtes Hüpfen
        isJumping = false;
    }

    // Boden erreichen
    if (positionY > gameContainer.clientHeight - pogostick.offsetHeight) {
        positionY = gameContainer.clientHeight - pogostick.offsetHeight;
        velocityY = bounceForce; // Leichtes Hüpfen am Boden
        isJumping = false;
    }

    // Begrenzungen (Ränder)
    positionX = Math.max(0, Math.min(positionX, gameContainer.clientWidth - pogostick.offsetWidth));

    // Pogostick-Position aktualisieren
    pogostick.style.left = positionX + 'px';
    pogostick.style.top = positionY + 'px';

    // Leichtes Verkleinern beim Sprung
    if (isJumping) {
        pogostick.style.transform = 'scaleY(0.9)';
    } else {
        pogostick.style.transform = 'scaleY(1)';
    }

    requestAnimationFrame(update);
}

update();