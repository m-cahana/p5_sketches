let seeds = [];
let scaleFactorX, scaleFactorY;
let rectSeed;

// Define default viewport size
const DEFAULT_WIDTH = 1440;
const DEFAULT_HEIGHT = 500;

// Helper function to scale coordinates
function scaleCoord(x, y) {
  const scale = min(scaleFactorX, scaleFactorY);
  const adjustedScale = 1 - (1 - scale) * 0.3; // Reduce scaling intensity by 30%
  return [x * adjustedScale, y * adjustedScale];
}

function setup() {
  // Hide the loading screen manually
  const loadingElement = document.getElementById("p5_loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }

  // Set canvas to full window size
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  angleMode(DEGREES);
  frameRate(100); // Set frame rate

  // Calculate scale factors based on default viewport size
  scaleFactorX = window.innerWidth / DEFAULT_WIDTH;
  scaleFactorY = window.innerHeight / DEFAULT_HEIGHT;

  // Scale brushes to adapt to canvas size
  brush.scaleBrushes(min(scaleFactorX, scaleFactorY));

  // Activate the flowfield we're going to use
  brush.field("seabed");

  for (let i = 0; i < 150; i++) seeds.push(random());

  // Set fixed seed for rectangle
  rectSeed = random(10000);
}

function generatePolygon(c1, c2, c3, t) {
  const yVariation = random(-15, 30); // Add random vertical variation
  const [scaledX1, scaledY1] = scaleCoord(c1[0], c1[1]);
  const [scaledX2, scaledY2] = scaleCoord(c2[0], c2[1]);
  const [scaledX3, scaledY3] = scaleCoord(c3[0], c3[1]);

  return [
    [
      scaledX1 + 2 * cos(360 * sin(random(0, 360) + t * 120)),
      scaledY1 + 2 * sin(random(0, 360) + t * 120) + yVariation,
    ],
    [
      scaledX2 + 10 * cos(360 * sin(random(0, 360) + t * 120)),
      scaledY2 + 10 * sin(random(0, 360) + t * 120) + yVariation,
    ],
    [
      scaledX3 + 2 * cos(360 * sin(random(0, 360) + t * 120)),
      scaledY3 + 2 * sin(random(0, 360) + t * 120) + yVariation,
    ],
  ];
}

function generateRect(x, y, width, height) {
  const [scaledX, scaledY] = scaleCoord(x, y);
  const [scaledWidth, scaledHeight] = scaleCoord(width, height);

  return [
    [scaledX - scaledWidth / 2, scaledY - scaledHeight / 2],
    [scaledX + scaledWidth / 2, scaledY - scaledHeight / 2],
    [scaledX + scaledWidth / 2, scaledY + scaledHeight / 2],
    [scaledX - scaledWidth / 2, scaledY + scaledHeight / 2],
  ];
}

function draw() {
  const t = frameCount / 10;

  // Always draw background first
  background("#1B2A4A");

  // Draw rectangle with fixed random seed
  const rectWidth = 200;
  const rectHeight = 100;

  // clouds
  push();
  randomSeed(rectSeed);
  brush.noField(); // Disable flowfield for rectangle
  brush.fill("#4ad6af", 60);
  brush.bleed(0.5);
  brush.noStroke();

  brush.rect(-width * 0.3, -400, rectWidth, rectHeight);
  brush.rect(width * 0.2, -400, rectWidth, rectHeight);
  brush.rect(width * 0.4, -200, rectWidth, rectHeight);
  brush.rect(width * 0.1, 200, rectWidth, rectHeight);
  brush.rect(-width * 0.6, 200, rectWidth, rectHeight);

  brush.noFill();
  brush.field("seabed"); // Re-enable flowfield for other elements
  pop();

  // Reset randomSeed for other elements
  randomSeed();

  const multiplier = 40;
  const xOffset = 0;
  // top flock
  for (let i = 0; i < 10; i++) {
    randomSeed(33213 * seeds[i]);
    brush.set("hatch_brush", "#ffffff", 0);

    const scale = min(scaleFactorX, scaleFactorY);
    brush.setHatch("marker", "#ffffff", scale < 1 ? (1.5 / scale) * 2 : 1.5);
    brush.hatch(10, 130, 0.8);

    // Scale flock coordinates
    const [scaledX1, scaledY1] = scaleCoord(
      -206 + i * multiplier + xOffset,
      -20 - (i * multiplier) / 2
    );
    const [scaledX2, scaledY2] = scaleCoord(
      -175 + i * multiplier + xOffset,
      -7 - (i * multiplier) / 2
    );
    const [scaledX3, scaledY3] = scaleCoord(
      -200 + i * multiplier + xOffset,
      14 - (i * multiplier) / 2
    );

    brush.polygon(
      generatePolygon(
        [scaledX1, scaledY1],
        [scaledX2, scaledY2],
        [scaledX3, scaledY3],
        t
      )
    );
  }

  // bottom flock
  for (let i = 1; i < 12; i++) {
    randomSeed(33213 * seeds[i]);
    brush.set("hatch_brush", "#ffffff", 0);

    const scale = min(scaleFactorX, scaleFactorY);
    brush.setHatch("marker", "#ffffff", scale < 1 ? (1.5 / scale) * 2 : 1.5);
    brush.hatch(10, 130, 0.8);

    // Scale flock coordinates
    const [scaledX1, scaledY1] = scaleCoord(
      -206 + i * multiplier + xOffset,
      -20 + (i * multiplier) / 2
    );
    const [scaledX2, scaledY2] = scaleCoord(
      -175 + i * multiplier + xOffset,
      -7 + (i * multiplier) / 2
    );
    const [scaledX3, scaledY3] = scaleCoord(
      -200 + i * multiplier + xOffset,
      14 + (i * multiplier) / 2
    );

    brush.polygon(
      generatePolygon(
        [scaledX1, scaledY1],
        [scaledX2, scaledY2],
        [scaledX3, scaledY3],
        t
      )
    );
  }

  push();
  noStroke();
  fill(50);
  pop();

  brush.noHatch();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  scaleFactorX = window.innerWidth / DEFAULT_WIDTH;
  scaleFactorY = window.innerHeight / DEFAULT_HEIGHT;
  brush.scaleBrushes(min(scaleFactorX, scaleFactorY));
}
