/**
 * Simple Starfield Background - Classic white stars on black
 * No colors, simple twinkling animation
 */

(function() {
    'use strict';

    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d', { alpha: false });
    
    let width, height;
    let stars = [];
    let animationId;
    
    // Configuration - Simple and elegant
    const CONFIG = {
        starCount: 300,
        minSize: 0.5,
        maxSize: 2.5,
        twinkleSpeed: 0.005
    };

    /**
     * Star class - Simple white stars
     */
    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * (CONFIG.maxSize - CONFIG.minSize) + CONFIG.minSize;
            this.opacity = Math.random() * 0.5 + 0.5;
            this.twinkleSpeed = Math.random() * CONFIG.twinkleSpeed + CONFIG.twinkleSpeed;
            this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
        }

        update() {
            // Simple twinkle effect
            this.opacity += this.twinkleSpeed * this.twinkleDirection;
            
            if (this.opacity >= 1) {
                this.opacity = 1;
                this.twinkleDirection = -1;
            } else if (this.opacity <= 0.3) {
                this.opacity = 0.3;
                this.twinkleDirection = 1;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    /**
     * Initialize canvas and stars
     */
    function init() {
        resize();
        createStars();
        animate();
        
        // Handle window resize
        window.addEventListener('resize', debounce(resize, 250));
    }

    /**
     * Resize canvas to fill window
     */
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Recreate stars on resize
        if (stars.length > 0) {
            createStars();
        }
    }

    /**
     * Create star field
     */
    function createStars() {
        stars = [];
        for (let i = 0; i < CONFIG.starCount; i++) {
            stars.push(new Star());
        }
    }

    /**
     * Animation loop
     */
    function animate() {
        // Clear with black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        
        // Update and draw stars
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        
        // Continue animation
        animationId = requestAnimationFrame(animate);
    }

    /**
     * Debounce function for resize events
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Cleanup on page unload
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
