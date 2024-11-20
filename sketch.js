let font;
let tSize = 250; // Text size
let speed = 5; // Particle speed
let attractionRadius = 25; // Radius within which particles are attracted to the cursor
let particles = [];
let cursorSize = 50; // Cursor size
let word = "hello"; // The word to display

function preload() {
  font = loadFont("Bolden-Display.ttf"); // Replace with your font file
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupWord(word); // Initialize particles to form the word
}

function draw() {
  background(128, 0, 32); // Background color

  // Update and display each particle
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.behaviors();
    p.show();
  }

  // Draw the transparent circle
  fill(255, 255, 0, 50); // Semi-transparent yellow
  noStroke();
  ellipse(mouseX, mouseY, cursorSize, cursorSize);

}

function setupWord(word) {
  particles = []; // Clear any existing particles
  let points = font.textToPoints(word, 0, 0, tSize, {
    sampleFactor: 0.15, // Adjust for more or fewer particles
  });

  // Center the word on the canvas
  let bounds = font.textBounds(word, 0, 0, tSize);
  let offsetX = (width - bounds.w) / 2 - bounds.x;
  let offsetY = (height - bounds.h) / 2 - bounds.y;

  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    let particle = new Particle(pt.x + offsetX, pt.y + offsetY, speed);
    particles.push(particle);
  }
}

function Particle(x, y, m) {
  this.pos = createVector(random(width), random(height)); // Start at random positions
  this.target = createVector(x, y); // Position forming the word
  this.vel = createVector();
  this.acc = createVector();
  this.maxSpeed = m;
  this.stuckToCursor = false; // Check if the particle is stuck to the cursor
  this.r = 4; // Particle size
}

Particle.prototype.behaviors = function () {
  let mouse = createVector(mouseX, mouseY);

  if (!this.stuckToCursor) {
    // Check for attraction to the cursor
    if (dist(this.pos.x, this.pos.y, mouseX, mouseY) < attractionRadius) {
      this.stuckToCursor = true; // Stick to the cursor
    } else {
      // Otherwise, move towards the target position to form the word
      let arrive = this.arrive(this.target);
      this.applyForce(arrive);
    }
  } else {
    // Once stuck, move with the cursor
    let angle = random(TWO_PI);
    let distance = random(0, cursorSize / 2); // Randomize position within the circle
    this.pos.x = mouseX + cos(angle) * distance;
    this.pos.y = mouseY + sin(angle) * distance;
  }
};

Particle.prototype.applyForce = function (force) {
  this.acc.add(force);
};

Particle.prototype.arrive = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  let speed = this.maxSpeed;
  if (d < 100) {
    // Slow down as the particle approaches its target
    speed = map(d, 0, 100, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  let steer = p5.Vector.sub(desired, this.vel);
  return steer;
};

Particle.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
};

Particle.prototype.show = function () {
  fill(255, 223, 0); // Particle color
  noStroke();
  ellipse(this.pos.x, this.pos.y, this.r, this.r); // Draw the particle
};

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}

