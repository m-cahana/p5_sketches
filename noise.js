// Noise tends to look smoother with coordinates that are very close together
// These values will be multiplied by the x and y coordinates to make the
// resulting values very close together
let xScale = 0.005; // Reduced from 0.015 for smoother transitions
let yScale = 0.005; // Reduced from 0.02 for smoother transitions

// Fixed values instead of sliders
let gap = 10;
let offset = 0;
let svgImages = []; // Array to hold all SVG sequences
let currentImageIndex = 0;
let lastChangeTime = 0;
const INITIAL_CHANGE_INTERVAL = 200; // milliseconds for initial animations
const FAST_CHANGE_INTERVAL = 125; // milliseconds starting from "hello"
const TOGGLE_INTERVAL = 125; // milliseconds for toggling between final states
let svgMask;
let ALPHA_THRESHOLD = 100; // Only count as intersection if alpha is above this value
const SIZE_MULTIPLIER = 2; // Multiplier for dots that intersect with SVG
const SPEED = 100; // Adjusted to a moderate speed
let inToggleMode = false; // Flag to track if we're in the final toggle mode
let toggleState = false; // Flag to track which toggle state we're in

function preload() {
  // Load all SVG sequences
  svgImages.push(loadImage("svgs/empty.svg"));
  svgImages.push(loadImage("svgs/h.svg"));
  svgImages.push(loadImage("svgs/he.svg"));
  svgImages.push(loadImage("svgs/hel.svg"));
  svgImages.push(loadImage("svgs/hell.svg"));
  svgImages.push(loadImage("svgs/hello.svg"));
  svgImages.push(loadImage("svgs/helloo.svg"));
  svgImages.push(loadImage("svgs/hellooo.svg"));
  svgImages.push(loadImage("svgs/helloooo.svg"));
  svgImages.push(loadImage("svgs/hellooooo.svg"));
  svgImages.push(loadImage("svgs/helloooooo.svg"));
  svgImages.push(loadImage("svgs/helloooooooo.svg"));
  svgImages.push(loadImage("svgs/hellooooooooo.svg"));
  svgImages.push(loadImage("svgs/helloooooooooo.svg")); // hello with 10 o's
  svgImages.push(loadImage("svgs/hellooooooooooo.svg")); // hello with 11 o's
  svgImages.push(loadImage("svgs/helloooooooooooo.svg")); // hello with 12 o's
  svgImages.push(loadImage("svgs/hellooooooooooooo.svg")); // hello with 13 o's
  // Final toggle states
  svgImages.push(loadImage("svgs/oooooooooo.svg")); // 10 o's
  svgImages.push(loadImage("svgs/ooooooooooo.svg")); // 11 o's
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create a graphics buffer for the SVG mask
  svgMask = createGraphics(width, height);
  svgMask.imageMode(CENTER);
  updateSvgMask(); // Initial mask setup

  // Initialize the dot color
  dotColor = color(255, 140, 80); // Lighter, warm orange
  lastChangeTime = millis(); // Initialize the timer
}

function updateSvgMask() {
  svgMask.clear();
  let currentImage;
  if (inToggleMode) {
    // Use either the 10 o's or 11 o's image based on toggle state
    currentImage = toggleState
      ? svgImages[svgImages.length - 1]
      : svgImages[svgImages.length - 2];
  } else {
    currentImage = svgImages[currentImageIndex];
  }

  svgMask.image(
    currentImage,
    width / 2,
    height / 2,
    currentImage.width * 5,
    currentImage.height * 5
  );
}

function draw() {
  let currentTime = millis();

  if (!inToggleMode) {
    // Index of the basic "hello.svg" (without extra o's)
    const HELLO_INDEX = 5; // This corresponds to the "hello.svg" in the preload array

    // Determine which interval to use based on current position
    const currentInterval =
      currentImageIndex >= HELLO_INDEX
        ? FAST_CHANGE_INTERVAL
        : INITIAL_CHANGE_INTERVAL;

    // Progress through the sequence until we reach the toggle phase
    if (currentTime - lastChangeTime >= currentInterval) {
      currentImageIndex++;
      if (currentImageIndex >= svgImages.length - 2) {
        // Switch to toggle mode when we reach the final two states
        inToggleMode = true;
        currentImageIndex = svgImages.length - 2;
      }
      lastChangeTime = currentTime;
      updateSvgMask();
    }
  } else {
    // Toggle between the last two states (10 and 11 o's)
    if (currentTime - lastChangeTime >= TOGGLE_INTERVAL) {
      toggleState = !toggleState;
      lastChangeTime = currentTime;
      updateSvgMask();
    }
  }

  // Increment offset to create continuous movement
  offset += SPEED;
  dotGrid();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
  // Update mask when window is resized
  svgMask = createGraphics(width, height);
  svgMask.imageMode(CENTER);
  updateSvgMask();

  // Calculate scale to fit SVG within window
  let scale = 1;
  let maxWidth = width * 0.8; // Leave 10% margin on each side
  let maxHeight = height * 0.8;

  if (svgImages[currentImageIndex].width * 5 > maxWidth) {
    scale = maxWidth / (svgImages[currentImageIndex].width * 5);
  }
  if (svgImages[currentImageIndex].height * 5 > maxHeight) {
    scale = Math.min(
      scale,
      maxHeight / (svgImages[currentImageIndex].height * 5)
    );
  }

  // Draw SVG with calculated scale
  svgMask.image(
    svgImages[currentImageIndex],
    width / 2,
    height / 2,
    svgImages[currentImageIndex].width * 5 * scale,
    svgImages[currentImageIndex].height * 5 * scale
  );
}

function dotGrid() {
  background(255);
  noStroke();
  fill(dotColor);

  // Translate to adjust for WEBGL coordinate system
  translate(-width / 2, -height / 2);

  // Loop through x and y coordinates, at increments set by gap
  for (let x = gap / 2; x < width; x += gap) {
    for (let y = gap / 2; y < height; y += gap) {
      // Calculate noise value using scaled and offset coordinates
      let noiseValue = noise((x + offset) * xScale, (y + offset) * yScale);
      let baseSize = noiseValue * gap;

      // Only check center point for intersection
      let pixelColor = svgMask.get(x, y);

      if (pixelColor[3] > ALPHA_THRESHOLD) {
        // If intersecting, draw larger circle
        circle(x, y, baseSize * SIZE_MULTIPLIER);
      } else {
        // If not intersecting, draw normal circle
        circle(x, y, baseSize);
      }
    }
  }
}
