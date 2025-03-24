const video = document.getElementById('camera');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

// Access the phone's camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    });
  })
  .catch((error) => {
    console.error('Camera access error:', error);
  });

// Enable drawing on the canvas
let isDrawing = false;
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = 'red'; // Color of the highlight
    ctx.lineWidth = 5;
    ctx.stroke();
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

// Save the highlighted image
document.getElementById('save').addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL();
  link.download = 'highlighted_area.png';
  link.click();
  navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    const video = document.getElementById('camera');
    video.srcObject = stream;
    video.play(); // Ensure the video starts playing
  })
  .catch((error) => {
    console.error('Camera access error:', error);
    alert('Unable to access the camera. Please check permissions.');
  });
});
