const balloon = document.getElementById('balloon');
const moleculesContainer = document.getElementById('molecules-container');
const temperatureSlider = document.getElementById('temperature');

const numMolecules = 100;
const molecules = [];
let baseSpeed = 2;
let balloonSize = 200; // Initial size

function initializeSimulation() {
    balloon.style.width = `${balloonSize}px`;
    balloon.style.height = `${balloonSize}px`;

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
    
    // V ∝ T (Charles's Law) -> r^3 ∝ T -> r ∝ T^(1/3)
    // For simplicity, we'll make the size change more visually apparent.
    const newSize = 180 + temperatureValue * 2;
    balloonSize = newSize;
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

initializeSimulation();
