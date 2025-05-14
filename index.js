// Import p5.js library
let script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js";
document.head.appendChild(script);

// Wait for p5.js to load before initializing our sketch
script.onload = function () {
  // Import our rubber plant sketch
  let rubberPlantScript = document.createElement("script");
  rubberPlantScript.src = "rubber_plant.js";
  document.body.appendChild(rubberPlantScript);
};

// Create a container for our sketch
let container = document.createElement("div");
container.id = "sketch-container";
document.body.appendChild(container);

// Add some basic styling
let style = document.createElement("style");
style.textContent = `
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #f0f0f0;
  }
  #sketch-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
document.head.appendChild(style);
