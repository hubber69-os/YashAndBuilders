/**
 * YASH PROPERTIES LIMITED - Ambient Starlight & Bokeh Particle Engine
 * High-performance 2D canvas simulation with 3D depth perspective & mouse repulsion
 */

(function () {
  const canvas = document.getElementById('ambient-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 110;

  let mouse = {
    x: -1000,
    y: -1000,
    radius: 120
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  class Particle {
    constructor() {
      this.init(true);
    }

    init(randomY = false) {
      this.x = Math.random() * width;
      this.y = randomY ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = Math.random() * 0.4 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.pulseSpeed = Math.random() * 0.02 + 0.008;
      this.pulse = Math.random() * Math.PI * 2;
      
      // Color palette: Gold, Royal Blue, Soft Diamond White
      const rand = Math.random();
      if (rand > 0.45) {
        this.color = `rgba(212, 175, 55, ${this.opacity})`; // Gold
        this.baseColor = '212, 175, 55';
      } else if (rand > 0.15) {
        this.color = `rgba(59, 130, 246, ${this.opacity})`; // Royal Blue
        this.baseColor = '59, 130, 246';
      } else {
        this.color = `rgba(248, 250, 252, ${this.opacity})`; // Diamond White
        this.baseColor = '248, 250, 252';
      }
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;

      this.pulse += this.pulseSpeed;
      const currentOpacity = (Math.sin(this.pulse) * 0.3 + 0.7) * this.opacity;
      this.color = `rgba(${this.baseColor}, ${currentOpacity})`;

      // Mouse distance interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 3;
        this.y -= Math.sin(angle) * force * 3;
      }

      // Reset when particle floats off top or sides
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.init(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.size > 1.8 ? 12 : 6;
      ctx.shadowColor = this.size > 1.8 ? 'rgba(212, 175, 55, 0.6)' : 'rgba(37, 99, 235, 0.4)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Subtle connection lines between close particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 85) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - dist / 85) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
