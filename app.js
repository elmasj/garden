// Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let baseImage = null; // Store the uploaded image
let isDrawing = false; // Flag to track drawing state
let overlayPath = []; // Array to store the overlay points
let lastTap = 0; // Timestamp of last tap (for double tap detection)

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
    startDrawingOnDoubleTap(event);
  }
