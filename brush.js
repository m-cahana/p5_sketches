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

  background("#1B2A4A"); // Dark blue background

  const X_OFFSET = -400; // Controls the overall horizontal position
  const triangle_config = [
    [-6, -20],
    [25, -7],
    [0, 14],
  ];

  for (let i = 0; i < 30; i++) {
    const multiplier = 30;
    const waveAmplitude = 50; // Controls the height of the wave
    const waveFrequency = 0.2; // Controls how many waves appear
    const yOffset = sin(i * 360 * waveFrequency + t * 2) * waveAmplitude;

    randomSeed(33213 * seeds[i]);
    brush.set("hatch_brush", "#E8B4B8", 2); // Light earthy pink

    brush.setHatch("marker", "#D4A5A8", 1); // Darker earthy pink
    brush.hatch(10, 130, 0.8);

    brush.polygon(
      generatePolygon(
        [
          triangle_config[0][0] + i * multiplier + X_OFFSET,
          triangle_config[0][1] + yOffset,
        ],
        [
          triangle_config[1][0] + i * multiplier + X_OFFSET,
          triangle_config[1][1] + yOffset,
        ],
        [
          triangle_config[2][0] + i * multiplier + X_OFFSET,
          triangle_config[2][1] + yOffset,
        ],
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
