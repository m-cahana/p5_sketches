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
  background("#ffffff");

  // Calculate scale factors based on a reference size of 1000x1000
  scaleFactorX = windowWidth / 1000;
  scaleFactorY = windowHeight / 1000;

  // Scale brushes to adapt to canvas size
  brush.scaleBrushes(min(scaleFactorX, scaleFactorY) * 1.5);

  // Activate the flowfield we're going to use
  brush.field("seabed");

  for (let i = 0; i < 150; i++) seeds.push(random());
}

function generatePolygon(c1, c2, c3, t) {
  return [
    [
      c1[0] + 2 * cos(360 * sin(random(0, 360) + t * 120)),
      c1[1] + 2 * sin(random(0, 360) + t * 120),
    ],
    [
      c2[0] + 10 * cos(360 * sin(random(0, 360) + t * 120)),
      c2[1] + 10 * sin(random(0, 360) + t * 120),
    ],
    [
      c3[0] + 2 * cos(360 * sin(random(0, 360) + t * 120)),
      c3[1] + 2 * sin(random(0, 360) + t * 120),
    ],
  ];
}

function draw() {
  const t = frameCount / 30;

  background("#ffe6d4");

  for (let i = 0; i < 10; i++) {
    const multiplier = 30;

    randomSeed(33213 * seeds[i]);
    brush.set("hatch_brush", "#003c32", 1);

    brush.setHatch("marker", "#e0b411", 1.1);
    brush.hatch(10, 130, 0.8);

    brush.polygon(
      generatePolygon(
        [-6 + i * multiplier, -20 - (i * multiplier) / 2],
        [25 + i * multiplier, -7 - (i * multiplier) / 2],
        [0 + i * multiplier, 14 - (i * multiplier) / 2],
        t
      )
    );
  }

  for (let i = 1; i < 10; i++) {
    const multiplier = 30;

    randomSeed(33213 * seeds[i]);
    brush.set("hatch_brush", "#003c32", 1);

    brush.setHatch("marker", "#e0b411", 1.1);
    brush.hatch(10, 130, 0.8);

    brush.polygon(
      generatePolygon(
        [-6 + i * multiplier, -20 + (i * multiplier) / 2],
        [25 + i * multiplier, -7 + (i * multiplier) / 2],
        [0 + i * multiplier, 14 + (i * multiplier) / 2],
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
