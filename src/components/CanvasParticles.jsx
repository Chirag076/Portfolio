import { useEffect, useRef } from "react";

const CanvasParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    let isMobile = window.innerWidth < 768;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobile = window.innerWidth < 768;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    /* Only run while the canvas is actually on screen. It used to animate for
       the entire length of the page, competing with every scroll scene. */
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    const mouse = { x: null, y: null, radius: isMobile ? 80 : 120 };

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= forceDirectionX * force * 1.5;
          this.y -= forceDirectionY * force * 1.5;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
      }
    }

    const init = () => {
      particles = [];
      // Significantly lower density for silky smooth performance
      const numberOfParticles = (canvas.width * canvas.height) / (isMobile ? 25000 : 20000);
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 1.2 + 0.8;
        let x = Math.random() * (window.innerWidth - size * 2) + size;
        let y = Math.random() * (window.innerHeight - size * 2) + size;
        let directionX = (Math.random() - 0.5) * 0.5;
        let directionY = (Math.random() - 0.5) * 0.5;
        let color = "rgba(255, 255, 255, 0.15)";
        particles.push(new Particle(x, y, directionX, directionY, size, color));
      }
    };

    const connect = () => {
      // Disable connections entirely if performance is a priority or on smaller CPUs
      // Only draw connections if distance is very small
      const maxDistance = isMobile ? 0 : 8000;
      if (maxDistance === 0) return;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distanceSq = dx * dx + dy * dy;
          
          if (distanceSq < maxDistance) {
            let opacity = 1 - distanceSq / maxDistance;
            ctx.strokeStyle = `rgba(228, 84, 150, ${opacity * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />;
};

export default CanvasParticles;
