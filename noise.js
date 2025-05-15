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
const CHANGE_INTERVAL = 500; // milliseconds
const TOGGLE_INTERVAL = 500; // milliseconds for toggling between final states
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
    // Progress through the sequence until we reach the toggle phase
    if (currentTime - lastChangeTime >= CHANGE_INTERVAL) {
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

      // Create a circular pattern of points to check
      let points = [];
      const numPoints = 8; // Number of points to check around the circle
      const radius = baseSize / 2; // Radius of the circle

      // Add center point
      points.push({ x: x, y: y });

      // Add points in a circular pattern
      for (let i = 0; i < numPoints; i++) {
        let angle = (i / numPoints) * TWO_PI;
        points.push({
          x: x + cos(angle) * radius,
          y: y + sin(angle) * radius,
        });
      }

      // Count intersections with a more precise threshold
      let intersectionCount = 0;
      for (let point of points) {
        let pixelColor = svgMask.get(point.x, point.y);
        if (pixelColor[3] > ALPHA_THRESHOLD) {
          intersectionCount++;
        }
      }

      // Require at least 3 points to intersect to consider it a true intersection
      const MIN_INTERSECTIONS = 3;

      // If no significant intersection, draw normal circle
      if (intersectionCount < MIN_INTERSECTIONS) {
        circle(x, y, baseSize);
      } else if (intersectionCount === points.length) {
        // Full intersection - draw larger circle
        circle(x, y, baseSize * SIZE_MULTIPLIER);
      } else {
        // Partial intersection - draw irregular shape
        for (let point of points) {
          let pixelColor = svgMask.get(point.x, point.y);
          let size =
            pixelColor[3] > ALPHA_THRESHOLD
              ? baseSize * SIZE_MULTIPLIER
              : baseSize;
          circle(point.x, point.y, size);
        }
      }
    }
  }
}
