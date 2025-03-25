// Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let baseImage = null; // Store the uploaded image
let isDrawing = false; // Flag to track drawing state
let overlayPath = []; // Array to store the overlay points
let lastTap = 0; // Timestamp of last tap (for double-tap detection)

// Helper function to get pointer position (works for both mouse and touch)
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
    overlayPath = []; // Reset overlay path
    alert('Image uploaded! Double-tap (mobile) or double-click (desktop) to start drawing.');
  };

  img.onerror = () => {
    alert('Failed to load the image. Please try another file.');
  };
});

// Double Tap/Click to Initiate Drawing
canvas.addEventListener('touchend', (event) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  if (tapLength < 300 && tapLength > 0) { // Double tap detected
    event.preventDefault(); // Prevent the default zoom/select behavior
    startDrawingOnDoubleTap(event);
  }
  lastTap = currentTime;
});

canvas.addEventListener('dblclick', (event) => {
  event.preventDefault(); // Prevent the default browser behavior
  startDrawingOnDoubleTap(event);
});

// Function to start drawing on double-tap/double-click
function startDrawingOnDoubleTap(event) {
  alert('Drawing initiated! Start freehand drawing.');
  isDrawing = true; // Enable drawing mode
  overlayPath = []; // Reset overlay path
  const pos = getPointerPosition(event);
  overlayPath.push(pos); // Add the starting point
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

// Draw freehand (supports mouse and touch)
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

// Stop drawing (finalize path)
function stopDrawing() {
  isDrawing = false; // Reset flag
  ctx.closePath(); // Close the path
}

// Add event listeners for drawing
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// Step 3: Upload and Apply the Second Image
document.getElementById('upload2').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) {
    alert('Please upload a second image!');
    return;
  }

  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;

  img.onload = () => {
    overlayImage = img;
    alert('Second image uploaded successfully!');
  };

  img.onerror = () => {
    alert('Failed to load the second image. Please try another file.');
