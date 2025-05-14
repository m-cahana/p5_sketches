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

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  background("#fffceb");

  // Calculate scale factors based on a reference size of 1000x1000
  scaleFactorX = windowWidth / 1000;
  scaleFactorY = windowHeight / 1000;

  // Scale brushes to adapt to canvas size
  brush.scaleBrushes(min(scaleFactorX, scaleFactorY) * 1.5);

  // Activate the flowfield we're going to use
  brush.field("seabed");

  for (let i = 0; i < 150; i++) seeds.push(random());
}

function draw() {
  const t = frameCount / 30;

  background("#ffe6d4");

  // Remember in WEBGL mode, (0,0) is at the center
  // We'll adjust all coordinates to be relative to center
  const centerX = 0;
  const centerY = 0;

  randomSeed(33213 * seeds[56]);
  brush.set("cpencil", "#003c32", 1);

  randomSeed(33213 * seeds[35]);

  randomSeed(33213 * seeds[75]);

  brush.setHatch("marker", "#e0b411", 1.1);
  brush.hatch(10, 130, 0.2);
  brush.polygon([
    [
      (250 - 300) * scaleFactorX +
        20 * cos(360 * sin(random(0, 360) + t * 120)),
      (250 - 300) * scaleFactorY + 20 * sin(random(0, 360) + t * 120),
    ],
    [
      (500 - 300) * scaleFactorX +
        40 * cos(360 * sin(random(0, 360) + t * 120)),
      (300 - 300) * scaleFactorY + 50 * sin(random(0, 360) + t * 120),
    ],
    [
      (300 - 300) * scaleFactorX +
        10 * cos(360 * sin(random(0, 360) + t * 120)),
      (520 - 300) * scaleFactorY + 30 * sin(random(0, 360) + t * 120),
    ],
  ]);

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
