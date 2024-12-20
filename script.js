const pogostick = document.getElementById('pogostick');
const gameContainer = document.getElementById('game-container');
const confettiContainer = document.getElementById('confetti-container');
const navigationHeight = 100; // Höhe der Navigationsgrafik in Pixeln

// Variablen für Plattformen
let positionX = 200; // Startposition X
let positionY = gameContainer.clientHeight - 80; // Startposition Y (unten starten)
let velocityY = 0; // Vertikale Geschwindigkeit
let isJumping = false;
let bounceForce = -5; // Standard-Hüpfen
const platformCount = 6; // Anzahl der Plattformen
const platforms = [];
let trophy; // Der Pokal
let trophyPlatform; // Die Plattform mit dem Pokal

// Spielfeldgröße
const gameHeight = gameContainer.clientHeight;
const gameWidth = gameContainer.clientWidth;

// Touch-Steuerung
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Touchstart-Event (Startpunkt des Swipes speichern)
gameContainer.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX; // X-Koordinate des ersten Touches
    touchStartY = event.touches[0].clientY; // Y-Koordinate des ersten Touches
});

// Touchend-Event (Endpunkt des Swipes speichern)
gameContainer.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].clientX; // X-Koordinate des letzten Touches
    touchEndY = event.changedTouches[0].clientY; // Y-Koordinate des letzten Touches
    handleSwipe(); // Swipe verarbeiten
});

function handleSwipe() {
    const swipeDistanceX = touchEndX - touchStartX; // Differenz der X-Koordinaten
    const swipeDistanceY = touchEndY - touchStartY; // Differenz der Y-Koordinaten
    const swipeThreshold = 50; // Mindest-Swipe-Länge, um als Wisch zu zählen

    if (Math.abs(swipeDistanceY) > swipeThreshold && Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX)) {
        // Vertikaler Swipe (nach oben oder unten)
        if (swipeDistanceY < 0) {
            // Swipe nach oben
            if (!isJumping) {
                isJumping = true;
                velocityY = -17; // Sprunggeschwindigkeit
            }
        }
    } else if (Math.abs(swipeDistanceX) > swipeThreshold) {
        // Horizontaler Swipe (nach links oder rechts)
        if (swipeDistanceX > 0) {
            // Swipe nach rechts
            positionX += 80; // Bewege nach rechts
        } else {
            // Swipe nach links
            positionX -= 80; // Bewege nach links
        }

        // Beim horizontalen Swipe immer springen
        if (!isJumping) {
            isJumping = true;
            velocityY = -17; // Sprunggeschwindigkeit
        }
    }
}

// Plattformen dynamisch erstellen
function createPlatforms() {
    const availableHeight = gameHeight - navigationHeight - 100; // Platz unter der Navigationsgrafik
    const stepHeight = availableHeight / (platformCount - 1); // Abstand zwischen Plattformen

    const maxWidth = 400; // Maximale Breite des Plattformbereichs
    const containerWidth = Math.min(maxWidth, gameWidth); // Begrenzen auf maxWidth oder Bildschirmbreite
    const centerX = gameWidth / 2; // Bildschirmmitte
    const platformWidth = 100; // Breite einer Plattform

    for (let i = 0; i < platformCount; i++) {
        const platform = document.createElement('div');
        platform.classList.add('platform');

        const verticalPosition = navigationHeight + 50 + i * stepHeight; // Position unterhalb der Navigationsgrafik
        const horizontalPosition =
            centerX - containerWidth / 2 + Math.random() * (containerWidth - platformWidth); // Zufällige Position in der Breite (zentriert)

        platform.style.top = `${verticalPosition}px`;
        platform.style.left = `${horizontalPosition}px`;

        gameContainer.appendChild(platform);
        platforms.push(platform);

        // Pokal zur obersten Plattform hinzufügen
        if (i === platformCount - 6) {
            trophyPlatform = platform; // Speichere die Plattform mit dem Pokal
            addTrophy(verticalPosition, horizontalPosition);
        }
    }
}

// Pokal hinzufügen
function addTrophy(verticalPosition, horizontalPosition) {
    trophy = document.createElement('img');
    trophy.src = "assets/images/trophy.svg"; // Pfad zur Pokal-Grafik
    trophy.classList.add('trophy');
    trophy.style.top = `${verticalPosition - 50}px`; // Pokal oberhalb der Plattform platzieren
    trophy.style.left = `${horizontalPosition + 25}px`; // Zentrieren
    gameContainer.appendChild(trophy);
}

function isOnPlatform() {
    for (const platform of platforms) {
        const platformRect = platform.getBoundingClientRect();
        const pogoRect = pogostick.getBoundingClientRect();

        if (
            pogoRect.bottom >= platformRect.top &&
            pogoRect.bottom <= platformRect.bottom + 10 &&
            pogoRect.left < platformRect.right &&
            pogoRect.right > platformRect.left
        ) {
            return platform;
        }
    }
    return null;
}

function checkTrophyPlatformCollision() {
    if (!trophyPlatform) return;

    const trophyPlatformRect = trophyPlatform.getBoundingClientRect();
    const pogoRect = pogostick.getBoundingClientRect();

    // Prüfen, ob der Pogostick auf der Plattform mit dem Pokal landet
    if (
        pogoRect.bottom >= trophyPlatformRect.top &&
        pogoRect.bottom <= trophyPlatformRect.bottom + 10 &&
        pogoRect.left < trophyPlatformRect.right &&
        pogoRect.right > trophyPlatformRect.left
    ) {
        showConfetti();
        setTimeout(() => location.reload(), 4000); // Nach 4 Sekunden neu laden
    }
}

function showConfetti() {
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Zufällige Eigenschaften
        const size = Math.random() * 10 + 5; // Größe zwischen 5px und 15px
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Zufällige Farben
        const left = Math.random() * 100; // Zufällige Position
        const rotation = Math.random() * 360; // Drehung
        const animationDuration = Math.random() * 3 + 2; // Dauer 2-5 Sekunden

        // Styling des Konfettis
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.position = 'absolute';
        confetti.style.left = `${left}%`;
        confetti.style.top = `0%`;
        confetti.style.borderRadius = '50%';
        confetti.style.transform = `rotate(${rotation}deg)`;
        confetti.style.animation = `fall ${animationDuration}s ease-out`;

        confettiContainer.appendChild(confetti);

        // Entferne Konfetti nach Animation
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            positionX -= 40;
            break;
        case 'ArrowRight':
            positionX += 40;
            break;
        case 'ArrowUp':
            if (!isJumping) {
                isJumping = true;
                velocityY = -17;
            }
            break;
    }
});

function update() {
    velocityY += 1; // Schwerkraft
    positionY += velocityY;

    const platform = isOnPlatform();
    if (platform && velocityY > 0) {
        const platformRect = platform.getBoundingClientRect();
        positionY = platformRect.top - pogostick.offsetHeight + gameContainer.scrollTop;
        velocityY = bounceForce;
        isJumping = false;
    }

    if (positionY > gameContainer.clientHeight - pogostick.offsetHeight) {
        positionY = gameContainer.clientHeight - pogostick.offsetHeight;
        velocityY = bounceForce;
        isJumping = false;
    }

    positionX = Math.max(0, Math.min(positionX, gameContainer.clientWidth - pogostick.offsetWidth));

    pogostick.style.left = `${positionX}px`;
    pogostick.style.top = `${positionY}px`;

    checkTrophyPlatformCollision(); // Prüfen, ob der Pogostick auf der Plattform mit dem Pokal ist

    requestAnimationFrame(update);
}


createPlatforms();
update();

