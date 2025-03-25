// Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let baseImage = null; // Store the uploaded image
let isDrawing = false; // Flag to track drawing state
let overlayPath = []; // Array to store the overlay points

// Rectangle for touch starting point
const startRect = {
  x: 100, // Initial position
  y: 100,
  width: 30, // Rectangle width
  height: 30,
  isDragging: false, // Flag to track drag state
};

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

    // Draw the draggable rectangle
    drawStartRect();
  };

  img.onerror = () => {
    alert('Failed to load the image. Please try another file.');
  };
});

// Draw the draggable rectangle
function drawStartRect() {
  ctx.fillStyle = 'blue'; // Set rectangle color
  ctx.fillRect(startRect.x, startRect.y, startRect.width, startRect.height);
}

// Start drawing (from rectangle position)
function startDrawing(event) {
  const pointer = getPointerPosition(event);

  // Check if touch/click is within the rectangle
  if (
    pointer.x >= startRect.x &&
    pointer.x <= startRect.x + startRect.width &&
    pointer.y >= startRect.y &&
    pointer.y <= startRect.y + startRect.height
  ) {
    isDrawing = true; // Set drawing flag
    overlayPath = []; // Reset the overlay path
    overlayPath.push({ x: pointer.x, y: pointer.y }); // Start from the rectangle
    ctx.beginPath();
    ctx.moveTo(pointer.x, pointer.y);
    startRect.isDragging = true; // Start dragging rectangle
  } else if (startRect.isDragging) {
    startRect.isDragging = false; // Stop dragging
  }

  event.preventDefault(); // Prevent default touch scrolling
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
  startRect.isDragging = false; // Stop dragging
}

// Add event listeners for mouse input
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// Add event listeners for touch input
canvas.addEventListener('touchstart', startDrawing);
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
