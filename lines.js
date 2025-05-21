let scaleFactor;
let frameCount = 0;
let isBlinking = false;
let blinkTimer = 0;
let nextBlinkTime = 0;
let spiralRotation = 0;
let spiralOffsets = [0, 60, 120, 180, 240, 300]; // Different starting rotations for each spiral

function setup() {
  // Hide the loading screen manually
  const loadingElement = document.getElementById("p5_loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }

  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  frameRate(10);

  // Calculate scale factor based on the average of width and height
  // Original sketch was designed for roughly 1000x1000
  // Add extra scaling for narrow windows
  scaleFactor = (windowWidth + windowHeight) / 2000;
  if (windowWidth < 500) {
    scaleFactor *= 0.6; // Reduce scale by 40% for narrow windows
  }
}

function drawLash(x, y, rotation) {
  push();
  translate(x * scaleFactor, y * scaleFactor);
  rotate(rotation);
  arc(0, 0, 20 * scaleFactor, 20 * scaleFactor, 160, 200);
  pop();
}

function drawEyeLashes(centerX, isLeftEye) {
  const numLashes = 10;
  const eyelidX = centerX * scaleFactor;
  const startX = eyelidX + (isLeftEye ? -25 : 30) * scaleFactor;
  const endX = eyelidX + (isLeftEye ? -125 : 140) * scaleFactor;
  const step = (endX - startX) / (numLashes - 1);
  const leftBaseY = -58 * scaleFactor;
  const rightBaseY = -50 * scaleFactor;
  const blinkOffset = isBlinking ? 15 * scaleFactor : 0;

  for (let i = 0; i < numLashes; i++) {
    const x = startX + i * step;
    const y =
      (isLeftEye ? leftBaseY : rightBaseY) +
      (i < 3 || i > 7 ? 2 : 1) * scaleFactor +
      (i < 2 || i > 8 ? 1 : 0) * scaleFactor +
      blinkOffset;
    const rotation = isLeftEye ? -30 : 30;
    drawLash(x / scaleFactor, y / scaleFactor, rotation);
  }
}

function drawSpiral(x, y, size, rotations, spiralIndex) {
  push();
  translate(x * scaleFactor, y * scaleFactor);
  rotate(spiralRotation + spiralOffsets[spiralIndex]);
  beginShape();
  for (let i = 0; i < rotations * 360; i += 2) {
    let radius = (i / 360) * size * scaleFactor;
    let angle = i;
    let x1 = cos(angle) * radius;
    let y1 = sin(angle) * radius;
    vertex(x1, y1);
  }
  endShape();
  pop();
}

function draw() {
  background("#FFE4C4");
  stroke(0);
  strokeWeight(2 * scaleFactor);
  noFill();

  // Update spiral rotation
  spiralRotation += 30;

  // Handle blinking after frame 40
  if (frameCount > 40) {
    if (blinkTimer === 0) {
      if (isBlinking) {
        nextBlinkTime = frameCount + floor(random(20, 70));
        isBlinking = false;
      } else if (frameCount >= nextBlinkTime) {
        isBlinking = true;
        blinkTimer = 10;
      }
    }
    if (isBlinking) {
      blinkTimer--;
    }
  }

  // Draw spirals first
  if (frameCount >= 1) {
    drawSpiral(-400, -200, 20, 3, 0);
  }

  if (frameCount >= 2) {
    drawSpiral(-400, 0, 20, 3, 1);
  }

  if (frameCount >= 3) {
    drawSpiral(-400, 200, 20, 3, 2);
  }

  if (frameCount >= 4) {
    drawSpiral(400, -200, 20, 3, 3);
  }

  if (frameCount >= 5) {
    drawSpiral(400, 0, 20, 3, 4);
  }

  if (frameCount >= 6) {
    drawSpiral(400, 200, 20, 3, 5);
  }

  // Draw features based on frameCount
  if (frameCount >= 7) {
    line(
      -250 * scaleFactor,
      -150 * scaleFactor,
      -250 * scaleFactor,
      100 * scaleFactor
    );
  }

  if (frameCount >= 8) {
    line(
      250 * scaleFactor,
      -150 * scaleFactor,
      250 * scaleFactor,
      100 * scaleFactor
    );
  }

  if (frameCount >= 9) {
    arc(0, -150 * scaleFactor, 500 * scaleFactor, 100 * scaleFactor, 180, 0);
  }

  if (frameCount >= 10) {
    arc(0, 100 * scaleFactor, 500 * scaleFactor, 175 * scaleFactor, 0, 180);
  }

  if (frameCount >= 11) {
    if (!isBlinking) {
      arc(
        -100 * scaleFactor,
        -40 * scaleFactor,
        120 * scaleFactor,
        45 * scaleFactor,
        180,
        0
      );
    }
  }

  if (frameCount >= 12) {
    if (!isBlinking) {
      arc(
        -100 * scaleFactor,
        -40 * scaleFactor,
        120 * scaleFactor,
        45 * scaleFactor,
        0,
        180
      );
    }
  }

  if (frameCount >= 13) {
    if (!isBlinking) {
      arc(
        -100 * scaleFactor,
        -40 * scaleFactor,
        120 * scaleFactor,
        20 * scaleFactor,
        180,
        0
      );
    } else {
      arc(
        -100 * scaleFactor,
        -40 * scaleFactor,
        120 * scaleFactor,
        5 * scaleFactor,
        180,
        0
      );
    }
  }

  if (frameCount >= 14) {
    drawEyeLashes(-25, true);
  }

  if (frameCount >= 15) {
    if (!isBlinking) {
      arc(
        -100 * scaleFactor,
        -50 * scaleFactor,
        40 * scaleFactor,
        30 * scaleFactor,
        0,
        180
      );
      fill(0);
      arc(
        -100 * scaleFactor,
        -45 * scaleFactor,
        25 * scaleFactor,
        10 * scaleFactor,
        0,
        360
      );
      noFill();
    }
  }

  if (frameCount >= 16) {
    if (!isBlinking) {
      arc(
        100 * scaleFactor,
        -40 * scaleFactor,
        120 * scaleFactor,
        45 * scaleFactor,
        180,
        0
      );
    }
  }

  if (frameCount >= 17) {
    if (!isBlinking) {
      arc(
        100 * scaleFactor,
        -40 * scaleFactor,
        120 * scaleFactor,
        45 * scaleFactor,
        0,
        180
      );
    }
  }

  if (frameCount >= 18) {
    if (!isBlinking) {
      arc(
        100 * scaleFactor,
        -40 * scaleFactor,
        120 * scaleFactor,
        20 * scaleFactor,
        180,
        0
      );
    } else {
      arc(
        100 * scaleFactor,
        -40 * scaleFactor,
        120 * scaleFactor,
        5 * scaleFactor,
        180,
        0
      );
    }
  }

  if (frameCount >= 19) {
    drawEyeLashes(25, false);
  }

  if (frameCount >= 20) {
    if (!isBlinking) {
      arc(
        100 * scaleFactor,
        -50 * scaleFactor,
        40 * scaleFactor,
        30 * scaleFactor,
        0,
        180
      );
      fill(0);
      arc(
        100 * scaleFactor,
        -45 * scaleFactor,
        25 * scaleFactor,
        10 * scaleFactor,
        0,
        360
      );
      noFill();
    }
  }

  if (frameCount >= 21) {
    push();
    translate(0, 20 * scaleFactor);
    rotate(15);
    line(0, -20 * scaleFactor, 0, 20 * scaleFactor);
    pop();
  }

  if (frameCount >= 22) {
    arc(
      -33 * scaleFactor,
      100 * scaleFactor,
      66 * scaleFactor,
      16.5 * scaleFactor,
      180,
      0
    );
  }

  if (frameCount >= 23) {
    arc(
      33 * scaleFactor,
      100 * scaleFactor,
      66 * scaleFactor,
      16.5 * scaleFactor,
      180,
      0
    );
  }

  if (frameCount >= 24) {
    arc(0, 100 * scaleFactor, 132 * scaleFactor, 33 * scaleFactor, 0, 180);
  }

  if (frameCount >= 25) {
    bezier(
      0,
      -200 * scaleFactor,
      350 * scaleFactor,
      -220 * scaleFactor,
      275 * scaleFactor,
      -160 * scaleFactor,
      190 * scaleFactor,
      55 * scaleFactor
    );
  }

  if (frameCount >= 26) {
    bezier(
      -50 * scaleFactor,
      -210 * scaleFactor,
      370 * scaleFactor,
      -230 * scaleFactor,
      275 * scaleFactor,
      -170 * scaleFactor,
      225 * scaleFactor,
      75 * scaleFactor
    );
  }

  if (frameCount >= 27) {
    bezier(
      -110 * scaleFactor,
      -210 * scaleFactor,
      370 * scaleFactor,
      -240 * scaleFactor,
      275 * scaleFactor,
      -180 * scaleFactor,
      240 * scaleFactor,
      95 * scaleFactor
    );
  }

  if (frameCount >= 28) {
    bezier(
      -225 * scaleFactor,
      -190 * scaleFactor,
      370 * scaleFactor,
      -240 * scaleFactor,
      275 * scaleFactor,
      -180 * scaleFactor,
      260 * scaleFactor,
      105 * scaleFactor
    );
  }

  if (frameCount >= 29) {
    bezier(
      0,
      -200 * scaleFactor,
      -350 * scaleFactor,
      -220 * scaleFactor,
      -275 * scaleFactor,
      -160 * scaleFactor,
      -190 * scaleFactor,
      55 * scaleFactor
    );
  }

  if (frameCount >= 30) {
    bezier(
      100 * scaleFactor,
      -200 * scaleFactor,
      -370 * scaleFactor,
      -230 * scaleFactor,
      -275 * scaleFactor,
      -200 * scaleFactor,
      -220 * scaleFactor,
      75 * scaleFactor
    );
  }

  if (frameCount >= 31) {
    bezier(
      150 * scaleFactor,
      -200 * scaleFactor,
      -370 * scaleFactor,
      -240 * scaleFactor,
      -275 * scaleFactor,
      -180 * scaleFactor,
      -240 * scaleFactor,
      95 * scaleFactor
    );
  }

  if (frameCount >= 32) {
    bezier(
      225 * scaleFactor,
      -190 * scaleFactor,
      -370 * scaleFactor,
      -230 * scaleFactor,
      -275 * scaleFactor,
      -200 * scaleFactor,
      -275 * scaleFactor,
      115 * scaleFactor
    );
  }

  frameCount++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scaleFactor = (windowWidth + windowHeight) / 2000;
  if (windowWidth < 500) {
    scaleFactor *= 0.6; // Reduce scale by 40% for narrow windows
  }
}

function mouseMoved() {
  // Convert from screen coordinates to canvas coordinates
  const canvasX = mouseX - width / 2;
  const canvasY = mouseY - height / 2;
  console.log(`Mouse position: (${canvasX}, ${canvasY})`);
}
