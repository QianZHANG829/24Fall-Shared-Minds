// with the help from chatgpt 4o
// Get the input box and canvas elements
const inputBox = document.getElementById('inputBox');
const canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// Store an array of bubbles
let bubbles = [];

// Generate a random purple color
function getRandomPurpleColor() {
    const r = 128 + Math.floor(Math.random() * 64); // Red component between 128-192
    const g = Math.floor(Math.random() * 64); // Green component close to 0 to keep it purple
    const b = 128 + Math.floor(Math.random() * 64); // Blue component between 128-192
    return `rgb(${r}, ${g}, ${b})`;
}

// Bubble class to represent each bubble
class Bubble {
    constructor(text, x, y) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = 30; // Size of the text in the bubble
        this.dx = (Math.random() - 0.5) * 4; // Horizontal speed of the bubble
        this.dy = (Math.random() - 0.5) * 4; // Vertical speed of the bubble
        this.rippleRadius = 0; // Radius of the ripple
        this.rippleAlpha = 1; // Transparency of the ripple
        this.textWidth = ctx.measureText(this.text).width;
        this.rippleMaxRadius = this.textWidth / 2 + 500; // Maximum radius of the ripple
        this.color = getRandomPurpleColor(); // Randomly generate purple color
    }

    // Draw the bubble
    draw() {
        // Set the text style
        ctx.font = `${this.size}px Arial`;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';

        // Get the width of the text
        const textWidth = ctx.measureText(this.text).width;
        
        // Draw the text at the specified position
        ctx.fillText(this.text, this.x - textWidth / 2, this.y);

        // The ripple effect center should be at the center of the text
        const rippleCenterX = this.x;
        const rippleCenterY = this.y - this.size / 2; // Vertical offset from text baseline to center

        // Extract RGB color
        const [r, g, b] = this.color.match(/\d+/g);
        const gradient = ctx.createRadialGradient(rippleCenterX, rippleCenterY, 0, rippleCenterX, rippleCenterY, this.rippleRadius);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.rippleAlpha})`); 
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`); // Transparent

        // Draw the ripple with gradient fill
        if (this.rippleAlpha > 0) {
            ctx.beginPath();
            ctx.arc(rippleCenterX, rippleCenterY, this.rippleRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // Update the position of the bubble and ripple effect
    update() {
        // Update bubble position
        this.x += this.dx;
        this.y += this.dy;

        // Check for boundary collisions, ensuring the bubble stays within the canvas
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.dx *= -1; // Horizontal boundary bounce
        }

        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.dy *= -1; // Vertical boundary bounce
        }

        // Update ripple effect
        if (this.rippleRadius < this.rippleMaxRadius) {
            this.rippleRadius += 1; // Increase ripple radius
            this.rippleAlpha -= 0.02; // Gradually decrease transparency
        } else {
            // Reset ripple
            this.rippleRadius = 0;
            this.rippleAlpha = 1;
        }

        this.draw();
    }
}

// Listen to keydown events on the input box
inputBox.addEventListener('keydown', function (event) {
    // Check if the Enter key is pressed
    if (event.key === 'Enter') {
        const inputValue = inputBox.value;
        const x = Math.random() * canvas.width; // Random initial X position for the bubble
        const y = Math.random() * canvas.height; // Random initial Y position for the bubble

        // Create a new bubble object
        const newBubble = new Bubble(inputValue, x, y);
        bubbles.push(newBubble); // Add the bubble to the array

        // Clear the input box
        inputBox.value = '';
    }
});

// Move the input box to where the user clicks on the canvas
document.addEventListener('mousedown', (event) => {
    inputBox.style.left = event.clientX + 'px';
    inputBox.style.top = event.clientY + 'px';
});

// Animation loop to keep the bubbles moving and updating ripple effect
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Update all bubbles' positions and ripple effects
    bubbles.forEach(bubble => bubble.update());

    requestAnimationFrame(animate); // Recursively call to maintain animation loop
}

// Start the animation
animate();
