// Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let baseImage = null; // Store the uploaded image
let isDrawing = false; // Flag to track drawing state
let overlayPath = []; // Array to store the overlay points

// Helper function to get pointer position (for both mouse and touch)
function getPointerPosition(event) {
  const rect = canvas.getBoundingClientRect(); // Get canvas position
  const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
  const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;
  return { x, y };
}

// Step 1: Upload and Display the First Image
document.getElementById('upload1').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) {
    alert('Please upload an image!');
    return;
  }

  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;

  img.onload = () => {
    baseImage = img;

    // Clear canvas and draw the uploaded image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  };

  img.onerror = () => {
    alert('Failed to load the image. Please try another file.');
  };
});

// Start drawing (supports mouse and touch)
function startDrawing(event) {
  isDrawing = true; // Set flag to true
  overlayPath = []; // Reset the overlay path
  const pos = getPointerPosition(event);
  overlayPath.push(pos); // Add the starting point
  ctx.beginPath(); // Start a new path
  ctx.moveTo(pos.x, pos.y); // Move to the starting position
  event.preventDefault(); // Prevent default touch scrolling
}

// Draw as the pointer moves (supports mouse and touch)
function draw(event) {
  if (!isDrawing) return;

  const pos = getPointerPosition(event);
  overlayPath.push(pos); // Add the position to the overlay path

  ctx.lineTo(pos.x, pos.y); // Draw a line to the new position
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke(); // Render the stroke
  event.preventDefault(); // Prevent default touch scrolling
}

// Stop drawing (supports mouse and touch)
function stopDrawing() {
