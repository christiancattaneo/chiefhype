/**
 * Photorealistic Milky Way Night Sky
 * Rich colors like real astrophotography
 */

(function() {
    'use strict';

    console.log('[NIGHT SKY] Initializing photorealistic Milky Way...');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let rotation = 0;
    let animationId;

    // Configuration
    const CONFIG = {
        rotationSpeed: 0.00003, // Ultra slow - completes in ~3 hours
        whiteStars: 3000,
        milkyWayCoreStars: 6000,
        milkyWayEdgeStars: 3000
    };

    // Milky Way color palette (from real astrophotography)
    const MILKY_WAY_COLORS = {
        core: [
            { color: [255, 220, 180], weight: 0.3 }, // Warm orange/yellow (galactic core)
            { color: [255, 200, 150], weight: 0.2 }, // Gold
            { color: [255, 180, 120], weight: 0.15 }, // Deep orange
            { color: [200, 150, 255], weight: 0.15 }, // Purple (nebulae)
            { color: [255, 255, 255], weight: 0.2 }  // White
        ],
        edge: [
            { color: [150, 200, 255], weight: 0.25 }, // Blue (star forming regions)
            { color: [180, 150, 255], weight: 0.2 },  // Purple
            { color: [255, 200, 200], weight: 0.15 }, // Pink (H-alpha regions)
            { color: [200, 220, 255], weight: 0.2 },  // Light blue
            { color: [255, 255, 255], weight: 0.2 }   // White
        ]
    };

    /**
     * Star class with realistic colors
     */
    class Star {
        constructor(type = 'white') {
            this.angle = Math.random() * Math.PI * 2;
            this.type = type;
            
            if (type === 'milkyway-core') {
                // Dense core region
                this.distance = Math.random() * 0.15 + 0.25;
                this.size = Math.random() * 1.5 + 0.4;
                this.opacity = Math.random() * 0.7 + 0.3;
                this.color = this.pickColor(MILKY_WAY_COLORS.core);
            } else if (type === 'milkyway-edge') {
                // Outer regions
                this.distance = Math.random() * 0.25 + 0.15;
                this.size = Math.random() * 1.2 + 0.3;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = this.pickColor(MILKY_WAY_COLORS.edge);
            } else {
                // Normal white stars
                this.distance = Math.random() * 0.8;
                this.size = Math.random() * 2 + 0.5;
                this.opacity = Math.random() * 0.9 + 0.1;
                this.color = [255, 255, 255];
            }
            
            this.layer = type.includes('milkyway') ? 1 : (Math.random() > 0.5 ? 1.1 : 0.9);
            this.twinkleSpeed = Math.random() * 0.015 + 0.005;
            this.twinklePhase = Math.random() * Math.PI * 2;
        }

        pickColor(palette) {
            const rand = Math.random();
            let cumWeight = 0;
            for (let i = 0; i < palette.length; i++) {
                cumWeight += palette[i].weight;
                if (rand <= cumWeight) {
                    return palette[i].color;
                }
            }
            return palette[0].color;
        }

        update() {
            this.twinklePhase += this.twinkleSpeed;
        }

        getPosition(rotation) {
            const rotatedAngle = this.angle + (rotation * this.layer);
            const centerX = width * 0.5;
            const centerY = height * 0.45;
            
            if (this.type.includes('milkyway')) {
                // Milky Way band with realistic curve
                const bandRadius = Math.min(width, height) * (this.distance + 0.2);
                const offsetY = Math.sin(rotatedAngle * 1.5) * height * 0.2;
                
                return {
                    x: centerX + Math.cos(rotatedAngle) * bandRadius,
                    y: centerY + Math.sin(rotatedAngle) * bandRadius * 0.25 + offsetY
                };
            } else {
                // Full sky stars
                const radius = Math.min(width, height) * this.distance;
                return {
                    x: centerX + Math.cos(rotatedAngle) * radius,
                    y: centerY + Math.sin(rotatedAngle) * radius
                };
            }
        }

        draw(rotation) {
            const pos = this.getPosition(rotation);
            
            if (pos.x < -50 || pos.x > width + 50 || 
                pos.y < -50 || pos.y > height + 50) {
                return;
            }

            const twinkle = (Math.sin(this.twinklePhase) + 1) / 2;
            const finalOpacity = this.opacity * (0.7 + twinkle * 0.3);

            // Draw star
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${finalOpacity})`;
            ctx.fill();

            // Glow
            if (this.size > 1 && this.opacity > 0.4) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${finalOpacity * 0.1})`;
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
        console.log('[NIGHT SKY] Canvas added');
        
        resize();
        generateStars();
        animate();

        window.addEventListener('resize', resize);
        
        console.log('[NIGHT SKY] ✓ Photorealistic Milky Way ready');
    }

    /**
     * Generate stars
     */
    function generateStars() {
        stars = [];

        // Milky Way core (dense, warm colors)
        for (let i = 0; i < CONFIG.milkyWayCoreStars; i++) {
            stars.push(new Star('milkyway-core'));
        }

        // Milky Way edge (cooler colors)
        for (let i = 0; i < CONFIG.milkyWayEdgeStars; i++) {
            stars.push(new Star('milkyway-edge'));
        }

        // Background white stars
        for (let i = 0; i < CONFIG.whiteStars; i++) {
            stars.push(new Star('white'));
        }

        console.log('[NIGHT SKY] Stars:', CONFIG.milkyWayCoreStars, 'core +', CONFIG.milkyWayEdgeStars, 'edge +', CONFIG.whiteStars, 'white');
    }

    /**
     * Resize
     */
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    /**
     * Draw nebula clouds (background glow)
     */
    function drawNebulaClouds(rotation) {
        const centerX = width * 0.5;
        const centerY = height * 0.45;
        
        // Create large nebula-like glows
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * Math.PI * 2 + rotation;
            const radius = Math.min(width, height) * (0.25 + Math.random() * 0.1);
            const offsetY = Math.sin(angle * 1.5) * height * 0.2;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius * 0.25 + offsetY;
            
            // Vary colors for realism
            const colorChoice = Math.random();
            let color;
            if (colorChoice > 0.7) {
                color = '255, 200, 150'; // Orange/gold
            } else if (colorChoice > 0.4) {
                color = '180, 150, 255'; // Purple
            } else if (colorChoice > 0.2) {
                color = '255, 180, 200'; // Pink
            } else {
                color = '150, 200, 255'; // Blue
            }
            
            const glowSize = Math.random() * 120 + 80;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
            gradient.addColorStop(0, `rgba(${color}, 0.03)`);
            gradient.addColorStop(0.5, `rgba(${color}, 0.015)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x - glowSize, y - glowSize, glowSize * 2, glowSize * 2);
        }
    }

    /**
     * Animation loop
     */
    function animate() {
        // Clear - pure black
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Update rotation
        rotation += CONFIG.rotationSpeed;
        if (rotation >= Math.PI * 2) {
            rotation -= Math.PI * 2;
        }

        // Draw nebula clouds first (background layer)
        drawNebulaClouds(rotation);

        // Update and draw stars
        stars.forEach(star => {
            star.update();
            star.draw(rotation);
        });

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

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[NIGHT SKY] Script loaded');
})();
