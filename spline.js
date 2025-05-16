let scaleFactorX, scaleFactorY;
let rectangles = []; // Array to store all rectangles
let frameCount = 0; // Counter for frames

function setup() {
  // Hide the loading screen manually
  const loadingElement = document.getElementById("p5_loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }

  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  frameRate(10); // Set to 10 frames per second

  // Calculate scale factors based on a reference size of 1000x1000
  scaleFactorX = windowWidth / 1000;
  scaleFactorY = windowHeight / 1000;
}

function draw() {
  background("#ffffff");

  // Draw all existing rectangles
  for (let rectObj of rectangles) {
    push();
    noStroke();
    fill(rectObj.r, rectObj.g, rectObj.b, rectObj.a);
    rect(rectObj.x, rectObj.y, rectObj.w, rectObj.h);
    pop();
  }

  // Add one new rectangle each frame until we reach 200 frames
  if (frameCount < 50) {
    let newRect = {
      x: random(-width / 2, width / 2),
      y: random(-height / 2, height / 2),
      w: random(20, 200),
      h: random(20, 200),
      r: random(255),
      g: random(255),
      b: random(255),
      a: random(100, 255),
    };
    rectangles.push(newRect);
    frameCount++;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scaleFactorX = windowWidth / 1000;
  scaleFactorY = windowHeight / 1000;
}
