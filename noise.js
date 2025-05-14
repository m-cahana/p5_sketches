// Noise tends to look smoother with coordinates that are very close together
// These values will be multiplied by the x and y coordinates to make the
// resulting values very close together
let xScale = 0.005; // Reduced from 0.015 for smoother transitions
let yScale = 0.005; // Reduced from 0.02 for smoother transitions

// Fixed values instead of sliders
let gap = 8;
let offset = 0;
let svgImage;
let svgMask;
let ALPHA_THRESHOLD = 100; // Only count as intersection if alpha is above this value
const SIZE_MULTIPLIER = 2; // Multiplier for dots that intersect with SVG
const SPEED = 100; // Adjusted to a moderate speed

function preload() {
  svgImage = loadImage("hellooo.svg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a graphics buffer for the SVG mask
  svgMask = createGraphics(width, height);
  svgMask.imageMode(CENTER);
  // Make SVG 5x larger
  svgMask.image(
    svgImage,
    width / 2,
    height / 2,
    svgImage.width * 5,
    svgImage.height * 5
  );

  // Initialize the dot color
  dotColor = color(135, 206, 235); // Sky blue color
}

function draw() {
  // Increment offset to create continuous movement
  offset += SPEED;
  dotGrid();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Update mask when window is resized
  svgMask = createGraphics(width, height);
  svgMask.imageMode(CENTER);

  // Calculate scale to fit SVG within window
  let scale = 1;
  let maxWidth = width * 0.8; // Leave 10% margin on each side
  let maxHeight = height * 0.8;

  if (svgImage.width * 5 > maxWidth) {
    scale = maxWidth / (svgImage.width * 5);
  }
  if (svgImage.height * 5 > maxHeight) {
    scale = Math.min(scale, maxHeight / (svgImage.height * 5));
  }

  // Draw SVG with calculated scale
  svgMask.image(
    svgImage,
    width / 2,
    height / 2,
    svgImage.width * 5 * scale,
    svgImage.height * 5 * scale
  );
}

function dotGrid() {
  background(255);
  noStroke();
  fill(dotColor);

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
