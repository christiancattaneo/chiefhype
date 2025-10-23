/**
 * Simple overlay stars on top of panoramic Milky Way background
 * The main Milky Way is handled by CSS animation
 */

(function() {
    'use strict';

    console.log('[NIGHT SKY] Adding foreground stars...');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];

    /**
     * Star that drifts across screen
     */
    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.baseX = this.x;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.driftSpeed = 0.3; // Pixels per second
        }

        update(deltaTime) {
            this.twinklePhase += this.twinkleSpeed;
            
            // Drift to the right (matching Milky Way scroll direction)
            this.x += this.driftSpeed * deltaTime;
            
            // Wrap around when star goes off screen
            if (this.x > width + 50) {
                this.x = -50;
            }
        }

        draw() {
            const twinkle = (Math.sin(this.twinklePhase) + 1) / 2;
            const opacity = this.opacity * (0.6 + twinkle * 0.4);

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();

            // Glow for bright stars
            if (this.size > 1.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                ctx.fill();
            }
        }
    }

    function init() {
        const overlay = document.getElementById('stars-overlay');
        if (!overlay) return;
        
        overlay.appendChild(canvas);
        resize();
        generateStars();
        animate();
        
        window.addEventListener('resize', () => {
            resize();
            generateStars();
        });
        
        console.log('[NIGHT SKY] Foreground stars added:', stars.length);
    }

    function generateStars() {
        stars = [];
        for (let i = 0; i < 500; i++) {
            stars.push(new Star());
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    let lastTime = performance.now();
    
    function animate(currentTime) {
        const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
        lastTime = currentTime;
        
        ctx.clearRect(0, 0, width, height);
        
        stars.forEach(star => {
            star.update(deltaTime);
            star.draw();
        });
        
        requestAnimationFrame(animate);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
