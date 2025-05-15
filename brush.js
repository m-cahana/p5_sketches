// We define our palette
let palette = [
  "#2c695a",
  "#4ad6af",
  "#7facc6",
  "#4e93cc",
  "#f6684f",
  "#ffd300",
];

let seeds = [];
let scaleFactorX, scaleFactorY;
let rectSeed;

function setup() {
  // Hide the loading screen manually
  const loadingElement = document.getElementById("p5_loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }

  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  // Calculate scale factors based on a reference size of 1000x1000
  scaleFactorX = windowWidth / 1000;
  scaleFactorY = windowHeight / 1000;

  // Scale brushes to adapt to canvas size
  brush.scaleBrushes(min(scaleFactorX, scaleFactorY) * 1.5);

  // Activate the flowfield we're going to use
  brush.field("seabed");

  for (let i = 0; i < 150; i++) seeds.push(random());

  // Set fixed seed for rectangle
  rectSeed = random(10000);
}

function generatePolygon(c1, c2, c3, t) {
  const yVariation = random(-15, 30); // Add random vertical variation
  return [
    [
      c1[0] + 2 * cos(360 * sin(random(0, 360) + t * 120)),
      c1[1] + 2 * sin(random(0, 360) + t * 120) + yVariation,
    ],
    [
      c2[0] + 10 * cos(360 * sin(random(0, 360) + t * 120)),
      c2[1] + 10 * sin(random(0, 360) + t * 120) + yVariation,
    ],
    [
      c3[0] + 2 * cos(360 * sin(random(0, 360) + t * 120)),
      c3[1] + 2 * sin(random(0, 360) + t * 120) + yVariation,
    ],
  ];
}

function generateRect(x, y, width, height) {
  return [
    [x - width / 2, y - height / 2],
    [x + width / 2, y - height / 2],
    [x + width / 2, y + height / 2],
    [x - width / 2, y + height / 2],
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
  // top flock
  for (let i = 0; i < 10; i++) {
    randomSeed(33213 * seeds[i]);
    brush.set("hatch_brush", "#ffffff", 0);

    brush.setHatch("marker", "#ffffff", 1.5);
    brush.hatch(10, 130, 0.8);

    brush.polygon(
      generatePolygon(
        [-206 + i * multiplier, -20 - (i * multiplier) / 2],
        [-175 + i * multiplier, -7 - (i * multiplier) / 2],
        [-200 + i * multiplier, 14 - (i * multiplier) / 2],
        t
      )
    );
  }

  // bottom flock
  for (let i = 1; i < 12; i++) {
    randomSeed(33213 * seeds[i]);
    brush.set("hatch_brush", "#ffffff", 0);

    brush.setHatch("marker", "#ffffff", 1.5);
    brush.hatch(10, 130, 0.8);

    brush.polygon(
      generatePolygon(
        [-206 + i * multiplier, -20 + (i * multiplier) / 2],
        [-175 + i * multiplier, -7 + (i * multiplier) / 2],
        [-200 + i * multiplier, 14 + (i * multiplier) / 2],
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
  resizeCanvas(windowWidth, windowHeight);
  scaleFactorX = windowWidth / 1000;
  scaleFactorY = windowHeight / 1000;
  brush.scaleBrushes(min(scaleFactorX, scaleFactorY) * 1.5);
}
