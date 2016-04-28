// Code mostly stolen from https://www.thanassis.space/wavePhysics.html

var width = 400;
var height = 300;

var timer = -1;

var dc = null;
var canvas = null;
var imageData = null;

var activeBuffer = 0;

var waveBuffers = [new Float32Array(width * height), new Float32Array(width * height)];

var offsetLookup = new Int32Array(height);
for (var i = 0; i < height; i++) {
  offsetLookup[i] = width * i;
}

function setupCanvasAndStartSimulation() {
  canvas = document.getElementById("2dwaveDC");
  dc = canvas.getContext("2d");
  if (timer === -1) {
    timer = setInterval(function () {
      simulate();
    }, 60);
  }
  return true;
}

var oldWave;
var wave;
var lineOffset;
var prevLineOffset;
var nextLineOffset;
var image;
var val;

function simulate() {
  image = dc.getImageData(0, 0, width, height);
  wave = waveBuffers[activeBuffer];
  activeBuffer = (activeBuffer + 1) % 2;
  oldWave = waveBuffers[activeBuffer];
  for (var i = 1; i < height - 1; i++) {
    lineOffset = offsetLookup[i];
    prevLineOffset = offsetLookup[i - 1];
    nextLineOffset = offsetLookup[i + 1];
    for (var j = 1; j < width - 1; j++) {
      val = null;
      val = (
        (oldWave[prevLineOffset + j - 1] +
          oldWave[prevLineOffset + j + 1] +
          oldWave[nextLineOffset + j - 1] +
          oldWave[nextLineOffset + j + 1]) / 4 - oldWave[lineOffset + j] +

        oldWave[lineOffset + j - 1] +
        oldWave[lineOffset + j + 1] +
        oldWave[nextLineOffset + j] +
        oldWave[prevLineOffset + j]
      ) / 3 - wave[lineOffset + j];
      if (Math.random() < 0.00005) {
        val = 1 / Math.log(i + 1) * Math.random() / 2;
        if (Math.random() < 0.1 && (i / height < .1)) {
          val = Math.random();
        }
      }
      wave[lineOffset + j] = val * .999;

      val = Math.max(val, 0);
      val = Math.min(val, 1);
      var color = (255 * val + 255 * (i / height) * 1.1);
      if (color > 255) color = 255;
      image.data[4 * (lineOffset + j) + 0] = color;
      image.data[4 * (lineOffset + j) + 1] = color + 15;
      image.data[4 * (lineOffset + j) + 2] = color + 17;
      image.data[4 * (lineOffset + j) + 3] = color;
    }
  }
  dc.putImageData(image, 0, 0);
}

(function () {
  setupCanvasAndStartSimulation();
})();