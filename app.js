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
    overlayPath = []; // Reset overlay path
    alert('Image uploaded! Hold and drag on the canvas to draw.');
  };

  img.onerror = () => {
    alert('Failed to load the image. Please try another file.');
  };
});

// Hold and Drag to Draw (Touch)
canvas.addEventListener('touchstart', (event) => {
  isDrawing = true; // Enable drawing mode
  overlayPath = []; // Reset overlay path
  const pos = getPointerPosition(event);
  overlayPath.push(pos); // Add the starting point
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  event.preventDefault(); // Prevent default touch behavior
});

canvas.addEventListener('touchmove', (event) => {
  if (!isDrawing) return;

  const pos = getPointerPosition(event);
  overlayPath.push(pos); // Add the position to the overlay path

  ctx.lineTo(pos.x, pos.y); // Draw a line to the new position
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke(); // Render the stroke
  event.preventDefault(); // Prevent default touch scrolling
});

canvas.addEventListener('touchend', (event) => {
  isDrawing = false; // Disable drawing mode
  ctx.closePath(); // Close the path
  event.preventDefault(); // Prevent default touch zoom/select
});

// Draw with Mouse (Desktop)
canvas.addEventListener('mousedown', (event) => {
  isDrawing = true; // Enable drawing mode
  overlayPath = []; // Reset overlay path
  const pos = getPointerPosition(event);
  overlayPath.push(pos); // Add the starting point
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener('mousemove', (event) => {
  if (!isDrawing) return;

  const pos = getPointerPosition(event);
  overlayPath.push(pos); // Add the position to the overlay path

  ctx.lineTo(pos.x, pos.y); // Draw a line to the new position
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke(); // Render the stroke
});

canvas.addEventListener('mouseup', (event) => {
  isDrawing = false; // Disable drawing mode
  ctx.closePath(); // Close the path
});

canvas.addEventListener('mouseleave', () => {
  isDrawing = false; // Disable drawing mode when leaving the canvas
});

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
  };
});

document.getElementById('applyOverlay').addEventListener('click', () => {
  if (!baseImage || !overlayImage || overlayPath.length === 0) {
    alert('Please make sure both images are uploaded and the overlay area is drawn!');
    return;
  }

  // Clip the overlay area
  ctx.save();
  ctx.beginPath();
  overlayPath.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.closePath();
  ctx.clip();

  // Draw the second image within the clipped region
  ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

  ctx.restore();
});
