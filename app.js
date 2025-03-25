// Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let baseImage = null; // Store the uploaded image
let overlayImage = null; // Store the second uploaded image
let isDrawing = false; // Drawing mode flag
let overlayPath = []; // Path for the overlay area

// Helper function to get pointer position accurately
function getPointerPosition(event) {
  const rect = canvas.getBoundingClientRect(); // Get canvas position and dimensions

  // Calculate pointer position relative to the canvas
  const x = ((event.touches ? event.touches[0].clientX : event.clientX) - rect.left) * (canvas.width / rect.width);
  const y = ((event.touches ? event.touches[0].clientY : event.clientY) - rect.top) * (canvas.height / rect.height);

  // Return the corrected pointer position
  return { x: Math.round(x), y: Math.round(y) };
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
    alert('Image uploaded!');
  };

  img.onerror = () => {
    alert('Failed to load the image. Please try another file.');
  };
});

// Start Drawing Mode
document.getElementById('startDrawingButton').addEventListener('click', () => {
  if (!baseImage) {
    alert('Please upload an image before starting to draw.');
    return;
  }

  isDrawing = true; // Enable drawing mode
  alert('Drawing mode enabled! Hold and drag on the canvas to draw.');
});

// Draw Freehand (Mouse and Touch)
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Start Drawing
function startDrawing(event) {
  if (!isDrawing) return; // Do nothing if drawing mode is not enabled

  const pos = getPointerPosition(event);
  overlayPath = []; // Reset overlay path
  overlayPath.push(pos); // Add the starting point
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  event.preventDefault(); // Prevent default behavior
}

// Draw
function draw(event) {
  if (!isDrawing || overlayPath.length === 0) return;

  const pos = getPointerPosition(event);
  overlayPath.push(pos); // Add position to the path

  ctx.lineTo(pos.x, pos.y);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke();
  event.preventDefault(); // Prevent default scrolling on touch
}

// Stop Drawing
function stopDrawing() {
  if (!isDrawing) return; // Do nothing if drawing mode is not enabled

  isDrawing = false; // Disable drawing mode
  ctx.closePath();
}

// Step 2: Upload and Apply the Second Image
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

// Apply Overlay
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
