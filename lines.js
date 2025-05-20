let scaleFactorX, scaleFactorY;
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

  // Calculate scale factors based on a reference size of 1000x1000
  scaleFactorX = windowWidth / 1000;
  scaleFactorY = windowHeight / 1000;
}

function drawLash(x, y, rotation) {
  push();
  translate(x, y);
  rotate(rotation);
  arc(0, 0, 20, 20, 160, 200);
  pop();
}

function drawEyeLashes(centerX, isLeftEye) {
  const numLashes = 10;
  const eyelidX = centerX; // The eyelid is drawn at the same X as the eye center
  const startX = eyelidX + (isLeftEye ? -25 : 30);
  const endX = eyelidX + (isLeftEye ? -125 : 140);
  const step = (endX - startX) / (numLashes - 1);
  const leftBaseY = -58; // Starting Y position at eyelid level
  const rightBaseY = -50; // Starting Y position at eyelid level
  const blinkOffset = isBlinking ? 15 : 0; // Add offset when blinking

  for (let i = 0; i < numLashes; i++) {
    const x = startX + i * step;
    const y =
      (isLeftEye ? leftBaseY : rightBaseY) +
      (i < 3 || i > 7 ? 2 : 1) +
      (i < 2 || i > 8 ? 1 : 0) +
      blinkOffset; // Add blink offset to Y position
    const rotation = isLeftEye
      ? -30 // Left eye rotations
      : 30; // Right eye rotations
    drawLash(x, y, rotation);
  }
}

function drawSpiral(x, y, size, rotations, spiralIndex) {
  push();
  translate(x, y);
  rotate(spiralRotation + spiralOffsets[spiralIndex]); // Add individual offset
  beginShape();
  for (let i = 0; i < rotations * 360; i += 2) {
    let radius = (i / 360) * size;
    let angle = i;
    let x1 = cos(angle) * radius;
    let y1 = sin(angle) * radius;
    vertex(x1, y1);
  }
  endShape();
  pop();
}

function draw() {
  background("#FFE4C4"); // Lighter peach color (bisque)
  stroke(0);
  strokeWeight(2);
  noFill();

  // Update spiral rotation
  spiralRotation += 30;

  // Handle blinking after frame 40
  if (frameCount > 40) {
    if (blinkTimer === 0) {
      if (isBlinking) {
        // If we were blinking, schedule next blink
        nextBlinkTime = frameCount + floor(random(20, 70)); // Random time between 2-7 seconds
        isBlinking = false;
      } else if (frameCount >= nextBlinkTime) {
        // Time to blink
        isBlinking = true;
        blinkTimer = 10; // Blink for 10 frames
      }
    }
    if (isBlinking) {
      blinkTimer--;
    }
  }

  // Draw spirals first
  if (frameCount >= 1) {
    // Left side spirals
    drawSpiral(-400, -200, 20, 3, 0);
  }

  if (frameCount >= 2) {
    drawSpiral(-400, 0, 20, 3, 1);
  }

  if (frameCount >= 3) {
    drawSpiral(-400, 200, 20, 3, 2);
  }

  if (frameCount >= 4) {
    // Right side spirals
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
    // Left vertical line
    line(-250, -150, -250, 100);
  }

  if (frameCount >= 8) {
    // Right vertical line
    line(250, -150, 250, 100);
  }

  if (frameCount >= 9) {
    // Top arc
    arc(0, -150, 500, 100, 180, 0);
  }

  if (frameCount >= 10) {
    // Bottom arc
    arc(0, 100, 500, 175, 0, 180);
  }

  if (frameCount >= 11) {
    // Left eye top arc
    if (!isBlinking) {
      arc(-100, -40, 120, 45, 180, 0);
    }
  }

  if (frameCount >= 12) {
    // Left eye bottom arc
    if (!isBlinking) {
      arc(-100, -40, 120, 45, 0, 180);
    }
  }

  if (frameCount >= 13) {
    // Left eye top lid
    if (!isBlinking) {
      arc(-100, -40, 120, 20, 180, 0);
    } else {
      arc(-100, -40, 120, 5, 180, 0); // Blinking state
    }
  }

  if (frameCount >= 14) {
    // Left eye lashes
    drawEyeLashes(-25, true);
  }

  if (frameCount >= 15) {
    // Left eye arc and interior
    if (!isBlinking) {
      arc(-100, -50, 40, 30, 0, 180);
      fill(0);
      arc(-100, -45, 25, 10, 0, 360);
      noFill();
    }
  }

  if (frameCount >= 16) {
    // Right eye top arc
    if (!isBlinking) {
      arc(100, -40, 120, 45, 180, 0);
    }
  }

  if (frameCount >= 17) {
    // Right eye bottom arc
    if (!isBlinking) {
      arc(100, -40, 120, 45, 0, 180);
    }
  }

  if (frameCount >= 18) {
    // Right eye top lid
    if (!isBlinking) {
      arc(100, -40, 120, 20, 180, 0);
    } else {
      arc(100, -40, 120, 5, 180, 0); // Blinking state
    }
  }

  if (frameCount >= 19) {
    // Right eye lashes
    drawEyeLashes(25, false);
  }

  if (frameCount >= 20) {
    // Right eye arc and interior
    if (!isBlinking) {
      arc(100, -50, 40, 30, 0, 180);
      fill(0);
      arc(100, -45, 25, 10, 0, 360);
      noFill();
    }
  }

  if (frameCount >= 21) {
    // Nose
    push();
    translate(0, 20);
    rotate(15);
    line(0, -20, 0, 20);
    pop();
  }

  if (frameCount >= 22) {
    // Upper lip - left arc
    arc(-33, 100, 66, 16.5, 180, 0);
  }

  if (frameCount >= 23) {
    // Upper lip - right arc
    arc(33, 100, 66, 16.5, 180, 0);
  }

  if (frameCount >= 24) {
    // Bottom lip
    arc(0, 100, 132, 33, 0, 180);
  }

  if (frameCount >= 25) {
    // First hair strand
    bezier(0, -200, 350, -220, 275, -160, 190, 55);
  }

  if (frameCount >= 26) {
    // Second hair strand
    bezier(-50, -210, 370, -230, 275, -170, 225, 75);
  }

  if (frameCount >= 27) {
    // Third hair strand
    bezier(-110, -210, 370, -240, 275, -180, 240, 95);
  }

  if (frameCount >= 28) {
    // Fourth hair strand (left side)
    bezier(0, -200, -350, -220, -275, -160, -190, 55);
  }

  if (frameCount >= 29) {
    // Fifth hair strand (left side)
    bezier(50, -200, -370, -230, -275, -200, -220, 75);
  }

  if (frameCount >= 30) {
    // Sixth hair strand (left side)
    bezier(100, -200, -370, -240, -275, -180, -240, 95);
  }

  if (frameCount >= 31) {
    // Seventh hair strand (left side)
    bezier(150, -200, -370, -230, -275, -200, -275, 115);
  }

  frameCount++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scaleFactorX = windowWidth / 1000;
  scaleFactorY = windowHeight / 1000;
}

function mouseMoved() {
  // Convert from screen coordinates to canvas coordinates
  const canvasX = mouseX - width / 2;
  const canvasY = mouseY - height / 2;
  console.log(`Mouse position: (${canvasX}, ${canvasY})`);
}
