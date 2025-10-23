/**
 * Production-Quality Rotating Night Sky
 * Realistic Milky Way with proper rotation
 */

(function() {
    'use strict';

    console.log('[NIGHT SKY] Initializing production starfield...');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let rotation = 0;
    let animationId;

    // Configuration
    const CONFIG = {
        rotationSpeed: 0.00005, // Very slow, completes ~360° in 2 hours
        nearStars: 1500,
        farStars: 2500,
        milkyWayStars: 4000,
        centerX: 0.5, // Milky Way center position (proportion of screen)
        centerY: 0.45
    };

    /**
     * Star class
     */
    class Star {
        constructor(type = 'normal') {
            this.angle = Math.random() * Math.PI * 2;
            this.distance = type === 'milkyway' 
                ? Math.random() * 0.3 + 0.2  // Clustered in band
                : Math.random() * 0.7 + 0.1; // Distributed
            
            this.size = type === 'milkyway'
                ? Math.random() * 1.2 + 0.3
                : Math.random() * 2 + 0.5;
            
            this.opacity = type === 'milkyway'
                ? Math.random() * 0.4 + 0.1
                : Math.random() * 0.8 + 0.2;
            
            this.layer = type === 'near' ? 1.2 : type === 'far' ? 0.8 : 1;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.type = type;
        }

        update() {
            this.twinklePhase += this.twinkleSpeed;
        }

        getPosition(rotation) {
            // Calculate position with rotation
            const rotatedAngle = this.angle + (rotation * this.layer);
            const centerX = width * CONFIG.centerX;
            const centerY = height * CONFIG.centerY;
            
            if (this.type === 'milkyway') {
                // Milky Way band - create elongated distribution
                const bandAngle = rotatedAngle;
                const bandRadius = Math.min(width, height) * this.distance;
                
                // Create the curved Milky Way band
                const offsetY = Math.sin(bandAngle * 2) * height * 0.15;
                
                return {
                    x: centerX + Math.cos(bandAngle) * bandRadius,
                    y: centerY + Math.sin(bandAngle) * bandRadius * 0.3 + offsetY
                };
            } else {
                // Regular stars - full sky distribution
                const radius = Math.min(width, height) * this.distance;
                return {
                    x: centerX + Math.cos(rotatedAngle) * radius,
                    y: centerY + Math.sin(rotatedAngle) * radius
                };
            }
        }

        draw(rotation) {
            const pos = this.getPosition(rotation);
            
            // Skip if off screen
            if (pos.x < -50 || pos.x > width + 50 || 
                pos.y < -50 || pos.y > height + 50) {
                return;
            }

            // Twinkle effect
            const twinkle = (Math.sin(this.twinklePhase) + 1) / 2;
            const finalOpacity = this.opacity * (0.7 + twinkle * 0.3);

            // Draw star
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
            ctx.fill();

            // Glow for brighter stars
            if (this.size > 1.5 && this.opacity > 0.5) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, this.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity * 0.15})`;
                ctx.fill();
            }
        }
    }

    /**
     * Initialize
     */
    function init() {
        const container = document.getElementById('celestial-map');
        if (!container) {
            console.error('[NIGHT SKY] Container not found!');
            return;
        }
        
        container.appendChild(canvas);
        console.log('[NIGHT SKY] Canvas added to container');
        
        resize();
        generateStars();
        animate();

        window.addEventListener('resize', resize);
        
        console.log('[NIGHT SKY] ✓ Starfield initialized');
        console.log('[NIGHT SKY] Total stars:', stars.length);
        console.log('[NIGHT SKY] Rotation speed: 360° in ~2 hours');
    }

    /**
     * Generate realistic star distribution
     */
    function generateStars() {
        stars = [];

        // Milky Way band stars (concentrated)
        console.log('[NIGHT SKY] Generating Milky Way stars...');
        for (let i = 0; i < CONFIG.milkyWayStars; i++) {
            stars.push(new Star('milkyway'));
        }

        // Near stars (larger, brighter)
        console.log('[NIGHT SKY] Generating near stars...');
        for (let i = 0; i < CONFIG.nearStars; i++) {
            stars.push(new Star('near'));
        }

        // Far stars (smaller, fainter)
        console.log('[NIGHT SKY] Generating far stars...');
        for (let i = 0; i < CONFIG.farStars; i++) {
            stars.push(new Star('far'));
        }

        console.log('[NIGHT SKY] Total stars generated:', stars.length);
    }

    /**
     * Resize canvas
     */
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        console.log('[NIGHT SKY] Canvas resized:', width, 'x', height);
    }

    /**
     * Draw Milky Way glow
     */
    function drawMilkyWayGlow(rotation) {
        const centerX = width * CONFIG.centerX;
        const centerY = height * CONFIG.centerY;
        const maxRadius = Math.min(width, height) * 0.5;

        // Create Milky Way glow effect
        for (let i = 0; i < 360; i += 3) {
            const angle = (i * Math.PI / 180) + rotation;
            const radius = maxRadius * 0.25;
            const offsetY = Math.sin(angle * 2) * height * 0.15;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius * 0.3 + offsetY;

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 80);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.015)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x - 80, y - 80, 160, 160);
        }
    }

    /**
     * Animation loop
     */
    function animate() {
        // Clear canvas - pure black
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Update rotation (simulates Earth's rotation)
        rotation += CONFIG.rotationSpeed;
        if (rotation >= Math.PI * 2) {
            rotation -= Math.PI * 2;
            console.log('[NIGHT SKY] Completed full 360° rotation');
        }

        // Draw Milky Way glow first
        drawMilkyWayGlow(rotation);

        // Update and draw all stars
        stars.forEach(star => {
            star.update();
            star.draw(rotation);
        });

        // Continue animation
        animationId = requestAnimationFrame(animate);
    }

    /**
     * Cleanup
     */
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[NIGHT SKY] Script loaded');
})();
