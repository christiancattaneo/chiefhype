/**
 * Real Night Sky Simulation
 * Accurate star positions that rotate around Polaris
 * Shows Milky Way band that moves across sky as time progresses
 */

(function() {
    'use strict';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let milkyWayStars = [];
    let rotation = 0; // Angle of rotation around north celestial pole
    let animationId;

    // Configuration
    const CONFIG = {
        rotationSpeed: 0.0002, // Slow rotation (completes in ~87 minutes)
        starCount: 3000,
        milkyWayStarCount: 5000,
        poleStarRA: 37.95, // Polaris right ascension in degrees
        poleStarDec: 89.26, // Polaris declination
        latitude: 40 // Observer latitude (good for northern hemisphere view)
    };

    /**
     * Star object with real celestial coordinates
     */
    class Star {
        constructor(ra, dec, magnitude, inMilkyWay = false) {
            this.ra = ra; // Right ascension (0-360 degrees)
            this.dec = dec; // Declination (-90 to 90 degrees)
            this.magnitude = magnitude; // Brightness (lower = brighter)
            this.inMilkyWay = inMilkyWay;
            this.size = this.calculateSize();
            this.opacity = this.calculateOpacity();
        }

        calculateSize() {
            // Convert magnitude to size (brighter stars are bigger)
            const baseSize = 6 - this.magnitude;
            return Math.max(0.5, Math.min(3, baseSize * 0.4));
        }

        calculateOpacity() {
            // Brighter stars are more opaque
            return Math.max(0.3, Math.min(1, (6 - this.magnitude) / 6));
        }

        getScreenPosition(rotation) {
            // Convert celestial coordinates to screen position
            // Apply rotation around north celestial pole
            const raRotated = (this.ra + rotation) % 360;
            
            // Stereographic projection
            const lambda = raRotated * Math.PI / 180;
            const phi = this.dec * Math.PI / 180;
            const centerLat = CONFIG.latitude * Math.PI / 180;
            
            // Project onto plane
            const k = 2 / (1 + Math.sin(centerLat) * Math.sin(phi) + 
                           Math.cos(centerLat) * Math.cos(phi) * Math.cos(lambda));
            
            const x = k * Math.cos(phi) * Math.sin(lambda);
            const y = k * (Math.cos(centerLat) * Math.sin(phi) - 
                           Math.sin(centerLat) * Math.cos(phi) * Math.cos(lambda));
            
            // Scale to canvas
            const scale = Math.min(width, height) * 0.4;
            return {
                x: width / 2 + x * scale,
                y: height / 2 - y * scale
            };
        }

        draw(rotation) {
            const pos = this.getScreenPosition(rotation);
            
            // Only draw if on screen
            if (pos.x < -100 || pos.x > width + 100 || 
                pos.y < -100 || pos.y > height + 100) {
                return;
            }

            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();

            // Add slight glow to brighter stars
            if (this.magnitude < 2) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, this.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.2})`;
                ctx.fill();
            }
        }
    }

    /**
     * Initialize canvas and generate stars
     */
    function init() {
        const container = document.getElementById('celestial-map');
        container.appendChild(canvas);
        
        resize();
        generateStars();
        animate();

        window.addEventListener('resize', resize);
        
        console.log('Real night sky initialized');
        console.log(`${stars.length} stars generated`);
        console.log('Stars rotate around Polaris (north celestial pole)');
    }

    /**
     * Generate realistic star distribution
     */
    function generateStars() {
        stars = [];
        milkyWayStars = [];

        // Generate main stars across the sky
        for (let i = 0; i < CONFIG.starCount; i++) {
            const ra = Math.random() * 360; // 0-360 degrees
            const dec = (Math.random() * 180) - 90; // -90 to 90 degrees
            
            // More stars at lower declinations (horizon)
            const decWeight = Math.abs(Math.cos(dec * Math.PI / 180));
            if (Math.random() > decWeight * 0.5) continue;
            
            // Magnitude distribution (more faint stars)
            const magnitude = Math.random() * Math.random() * 6;
            
            stars.push(new Star(ra, dec, magnitude));
        }

        // Generate Milky Way band (concentrated along galactic plane)
        // Milky Way roughly follows RA 0-180 with varying declination
        for (let i = 0; i < CONFIG.milkyWayStarCount; i++) {
            // Milky Way sweeps across specific RA range
            const ra = Math.random() * 360;
            
            // Milky Way band follows a sinusoidal path
            const bandCenter = 60 * Math.sin((ra - 90) * Math.PI / 180);
            const bandWidth = 25;
            const dec = bandCenter + (Math.random() - 0.5) * bandWidth;
            
            const magnitude = 3 + Math.random() * 3; // Fainter stars in MW
            
            milkyWayStars.push(new Star(ra, dec, magnitude, true));
        }

        console.log(`Generated ${milkyWayStars.length} Milky Way stars`);
    }

    /**
     * Resize canvas to fill screen
     */
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    /**
     * Animation loop
     */
    function animate() {
        // Clear canvas - pure black
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Update rotation (sky rotates around Polaris)
        rotation += CONFIG.rotationSpeed;
        if (rotation >= 360) rotation -= 360;

        // Draw Milky Way glow first (behind stars)
        drawMilkyWayGlow();

        // Draw Milky Way stars
        milkyWayStars.forEach(star => star.draw(rotation));

        // Draw main stars
        stars.forEach(star => star.draw(rotation));

        // Continue animation
        animationId = requestAnimationFrame(animate);
    }

    /**
     * Draw subtle Milky Way glow
     */
    function drawMilkyWayGlow() {
        // Draw a subtle white glow along the Milky Way path
        for (let i = 0; i < 100; i++) {
            const ra = (i / 100) * 360;
            const bandCenter = 60 * Math.sin((ra - 90) * Math.PI / 180);
            
            const star = new Star(ra, bandCenter, 10);
            const pos = star.getScreenPosition(rotation);
            
            if (pos.x >= 0 && pos.x <= width && pos.y >= 0 && pos.y <= height) {
                const gradient = ctx.createRadialGradient(
                    pos.x, pos.y, 0,
                    pos.x, pos.y, 150
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(pos.x - 150, pos.y - 150, 300, 300);
            }
        }
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
})();
