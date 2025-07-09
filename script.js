const balloon = document.getElementById('balloon');
const moleculesContainer = document.getElementById('molecules-container');
const temperatureSlider = document.getElementById('temperature');

const numMolecules = 100;
const molecules = [];
let baseSpeed = 2;
let balloonSize; // Initial size will be set dynamically

function initializeSimulation() {
    updateBalloonSize();

    for (let i = 0; i < numMolecules; i++) {
        const moleculeElement = document.createElement('div');
        moleculeElement.classList.add('molecule');
        
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * (balloonSize / 2 - 10);
        
        const molecule = {
            element: moleculeElement,
            x: balloonSize / 2 + radius * Math.cos(angle),
            y: balloonSize / 2 + radius * Math.sin(angle),
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
        };
        
        molecules.push(molecule);
        moleculesContainer.appendChild(moleculeElement);
    }
    updateTemperature();
    animate();
}

function updateTemperature() {
    const temperatureValue = temperatureSlider.value;
    baseSpeed = temperatureValue / 25;
    updateBalloonSize();
}

function updateBalloonSize() {
    const containerSize = document.querySelector('.simulation-container').offsetWidth;
    const temperatureValue = temperatureSlider.value;
    // Adjust balloon size based on both container and temperature
    const baseBalloonSize = containerSize * 0.5; // Base size relative to container
    const tempEffect = (temperatureValue / 100) * (containerSize * 0.4);
    balloonSize = baseBalloonSize + tempEffect;

    balloon.style.width = `${balloonSize}px`;
    balloon.style.height = `${balloonSize}px`;
}

function animate() {
    molecules.forEach(m => {
        m.x += m.vx * baseSpeed;
        m.y += m.vy * baseSpeed;

        const distFromCenter = Math.sqrt(Math.pow(m.x - balloonSize / 2, 2) + Math.pow(m.y - balloonSize / 2, 2));

        if (distFromCenter > balloonSize / 2 - 5) {
            // Reflect velocity vector
            const normalX = (m.x - balloonSize / 2) / distFromCenter;
            const normalY = (m.y - balloonSize / 2) / distFromCenter;
            
            const dotProduct = m.vx * normalX + m.vy * normalY;
            
            m.vx -= 2 * dotProduct * normalX;
            m.vy -= 2 * dotProduct * normalY;

            // Move molecule back inside to prevent it from getting stuck
            m.x = balloonSize / 2 + (balloonSize / 2 - 5) * normalX;
            m.y = balloonSize / 2 + (balloonSize / 2 - 5) * normalY;
        }

        m.element.style.left = `${m.x}px`;
        m.element.style.top = `${m.y}px`;
    });

    requestAnimationFrame(animate);
}

temperatureSlider.addEventListener('input', updateTemperature);
window.addEventListener('resize', () => {
    // Re-initialize to adjust to new screen size
    moleculesContainer.innerHTML = '';
    molecules.length = 0;
    initializeSimulation();
});

initializeSimulation();
