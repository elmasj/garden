// Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let baseImage = null; // Store the uploaded image

// Step 1: Upload and Display the First Image
document.getElementById('upload1').addEventListener('change', (event) => {
  const file = event.target.files[0]; // Get the selected file
  if (!file) {
    alert('Please upload an image!');
    return;
  }

  const url = URL.createObjectURL(file); // Create a URL for the file
  const img = new Image(); // Create an image element
  img.src = url;

  img.onload = () => {
    baseImage = img; // Store the uploaded image for later use

    // Clear the canvas and draw the uploaded image
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear existing drawings
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height); // Draw the image
  };

  img.onerror = () => {
    alert('Failed to load the image. Please try another file.');
  };
});
let isDrawing = false; // Flag to track drawing state
let overlayPath = []; // Array to store the overlay points

// Start drawing when the mouse is pressed
canvas.addEventListener('mousedown', () => {
  isDrawing = true; // Set flag to true
  overlayPath = []; // Reset overlay path
});

// Helper function to get pointer position (works for both mouse and touch)
function getPointerPosition(event) {
  const rect = canvas.getBoundingClientRect(); // Get canvas position
  const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
  const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;
  return { x, y };
}

// Start drawing (supports mouse and touch)
function startDrawing(event) {
  isDrawing = true; // Set flag to true
  overlayPath = []; // Reset overlay path
  const pos = getPointerPosition(event);
  overlayPath.push(pos); // Add the initial position
  event.preventDefault(); // Prevent default touch behavior
}

// Draw as the pointer moves (supports mouse and touch)
function draw(event) {
  if (!isDrawing) return;

  const pos = getPointerPosition(event);
  overlayPath.push(pos); // Add the position to the overlay path

  ctx.strokeStyle = 'red'; // Set stroke color
  ctx.lineWidth = 2; // Set stroke width
  ctx.lineTo(pos.x, pos.y); // Add line to the current position
  ctx.stroke(); // Render the stroke
  event.preventDefault(); // Prevent default touch behavior
}

// Stop drawing (supports mouse and touch)
function stopDrawing() {
  isDrawing = false; // Reset flag
  ctx.beginPath(); // Reset the path for the next stroke
}

// Add event listeners for mouse
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing); // Stop drawing if the pointer leaves the canvas

// Add event listeners for touch
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);
// Step 3: Upload and Apply the Second Image
document.getElementById('upload2').addEventListener('change', (event) => {
  const file = event.target.files[0]; // Get the selected file
  if (!file) {
    alert('Please upload a second image!');
    return;
  }

  const url = URL.createObjectURL(file); // Create a URL for the file
  const img = new Image(); // Create a new image object
  img.src = url;

  img.onload = () => {
    overlayImage = img; // Store the second image for later use
    alert('Second image uploaded successfully!');
  };

  img.onerror = () => {
    alert('Failed to load the second image. Please try another file.');
  };
});

document.getElementById('applyOverlay').addEventListener('click', () => {
  if (!baseImage || !overlayImage || overlayPath.length === 0) {
    alert('Please make sure both images are uploaded and the overlay area is drawn!');
    return;
  }

  // Clip the overlay area
  ctx.save(); // Save the current canvas state
  ctx.beginPath(); // Begin a new path for the overlay area
  overlayPath.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y); // Move to the first point in the path
    } else {
      ctx.lineTo(point.x, point.y); // Draw lines to subsequent points
    }
  });
  ctx.closePath(); // Close the path to form a complete area
  ctx.clip(); // Clip the drawing region to the overlay area

  // Draw the second image within the clipped region
  ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

  ctx.restore(); // Restore the original canvas state
});

