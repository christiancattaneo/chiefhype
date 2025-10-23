/**
 * Real Night Sky - D3-Celestial with fallback to custom canvas
 * Extensive logging and error handling
 */

(function() {
    'use strict';

    console.log('[NIGHT SKY] ========================================');
    console.log('[NIGHT SKY] Script starting...');
    console.log('[NIGHT SKY] Timestamp:', new Date().toISOString());
    console.log('[NIGHT SKY] ========================================');

    let timeSpeed = 120;
    let currentTime = new Date();
    let animationRunning = false;
    let animationInterval;
    let useFallback = false;

    // Canvas variables for fallback
    let canvas, ctx, stars = [], milkyWayStars = [];
    let rotation = 0;

    /**
     * Check if D3-Celestial is available
     */
    function checkLibraries() {
        const d3Available = typeof d3 !== 'undefined';
        const celestialAvailable = typeof Celestial !== 'undefined';
        
        console.log('[NIGHT SKY] Library check:');
        console.log('[NIGHT SKY] - window.d3:', typeof d3);
        console.log('[NIGHT SKY] - window.Celestial:', typeof Celestial);
        console.log('[NIGHT SKY] - D3 available:', d3Available);
        console.log('[NIGHT SKY] - Celestial available:', celestialAvailable);
        
        if (d3Available && d3.version) {
            console.log('[NIGHT SKY] - D3 version:', d3.version);
        }
        
        return { d3Available, celestialAvailable };
    }

    /**
     * Initialize D3-Celestial
     */
    function initD3Celestial() {
        console.log('[NIGHT SKY] Attempting D3-Celestial initialization...');
        
        const container = document.getElementById('celestial-map');
        if (!container) {
            console.error('[NIGHT SKY] ERROR: Container not found!');
            return false;
        }
        
        console.log('[NIGHT SKY] Container found:', container);
        console.log('[NIGHT SKY] Container dimensions:', container.offsetWidth, 'x', container.offsetHeight);
        
        const config = {
            container: 'celestial-map',
            datapath: 'https://cdn.jsdelivr.net/npm/d3-celestial@0.7.30/data/',
            width: 0,
            projection: 'aitoff',
            transform: 'equatorial',
            center: null,
            orientationfixed: false,
            geopos: [0, 40],
            follow: 'zenith',
            zoomlevel: null,
            zoomextend: 1,
            adaptable: true,
            interactive: false,
            form: false,
            location: false,
            controls: false,
            background: {fill: '#000000', opacity: 1, stroke: '#000000', width: 0},
            stars: {
                show: true,
                limit: 6,
                colors: false,
                style: { fill: '#ffffff', opacity: 1 },
                designation: false,
                propername: false,
                size: 5,
                exponent: -0.28,
                data: 'stars.6.json'
            },
            dsos: {show: false},
            constellations: {show: false, names: false, lines: false, bounds: false},
            mw: {show: true, style: { fill: '#ffffff', opacity: 0.15 }},
            lines: {
                graticule: { show: false },
                equatorial: { show: false },
                ecliptic: { show: false },
                galactic: { show: false },
                supergalactic: { show: false }
            },
            planets: { show: false },
            horizon: { show: false },
            daylight: { show: false }
        };
        
        console.log('[NIGHT SKY] Config prepared:', config);
        
        try {
            console.log('[NIGHT SKY] Calling Celestial.display()...');
            Celestial.display(config);
            console.log('[NIGHT SKY] ✓ Celestial.display() completed successfully!');
            
            currentTime.setHours(2, 0, 0, 0);
            console.log('[NIGHT SKY] Initial time:', currentTime.toString());
            
            startD3Animation();
            return true;
            
        } catch (error) {
            console.error('[NIGHT SKY] ✗ ERROR in D3-Celestial initialization:');
            console.error('[NIGHT SKY] Error message:', error.message);
            console.error('[NIGHT SKY] Error stack:', error.stack);
            return false;
        }
    }

    /**
     * Start D3-Celestial animation
     */
    function startD3Animation() {
        if (animationRunning) return;
        
        animationRunning = true;
        console.log('[NIGHT SKY] Starting D3-Celestial animation (120x speed)');
        
        let frameCount = 0;
        animationInterval = setInterval(() => {
            currentTime = new Date(currentTime.getTime() + (1000 * timeSpeed));
            
            if (frameCount % 100 === 0) {
                console.log('[NIGHT SKY] Frame', frameCount, '- Time:', currentTime.toTimeString());
            }
            
            try {
                Celestial.date(currentTime);
                Celestial.redraw();
            } catch (error) {
                console.error('[NIGHT SKY] Animation error:', error);
            }
            
            frameCount++;
        }, 100);
        
        console.log('[NIGHT SKY] ✓ Animation loop started');
    }

    /**
     * Fallback: Custom canvas starfield
     */
    function initCanvasFallback() {
        console.log('[NIGHT SKY] ========================================');
        console.log('[NIGHT SKY] Initializing FALLBACK canvas starfield');
        console.log('[NIGHT SKY] ========================================');
        
        const container = document.getElementById('celestial-map');
        if (!container) {
            console.error('[NIGHT SKY] ERROR: Container not found for fallback!');
            return false;
        }
        
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        container.appendChild(canvas);
        
        resize();
        generateStars();
        animateCanvas();
        
        window.addEventListener('resize', resize);
        
        console.log('[NIGHT SKY] ✓ Fallback canvas initialized successfully');
        console.log('[NIGHT SKY] Generated', stars.length, 'stars');
        return true;
    }

    function generateStars() {
        stars = [];
        milkyWayStars = [];
        
        // Main stars
        for (let i = 0; i < 2000; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.7 + 0.3
            });
        }
        
        // Milky Way band
        for (let i = 0; i < 3000; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 200;
            const centerY = canvas.height * (0.4 + Math.sin(angle) * 0.2);
            
            milkyWayStars.push({
                x: Math.random() * canvas.width,
                y: centerY + (Math.random() - 0.5) * distance,
                size: Math.random() * 1.5 + 0.3,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
        
        console.log('[NIGHT SKY] Stars generated:', stars.length + milkyWayStars.length, 'total');
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log('[NIGHT SKY] Canvas resized:', canvas.width, 'x', canvas.height);
    }

    function animateCanvas() {
        // Clear
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Rotate effect
        rotation += 0.0001;
        
        // Draw Milky Way glow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        const mwY = canvas.height * 0.4;
        ctx.fillRect(0, mwY - 100, canvas.width, 200);
        
        // Draw Milky Way stars
        milkyWayStars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });
        
        // Draw main stars
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateCanvas);
    }

    /**
     * Main initialization
     */
    function init() {
        console.log('[NIGHT SKY] ========================================');
        console.log('[NIGHT SKY] Main initialization starting...');
        console.log('[NIGHT SKY] ========================================');
        
        const libs = checkLibraries();
        
        if (libs.d3Available && libs.celestialAvailable) {
            console.log('[NIGHT SKY] Both libraries available - trying D3-Celestial');
            const success = initD3Celestial();
            
            if (!success) {
                console.log('[NIGHT SKY] D3-Celestial failed - switching to fallback');
                useFallback = true;
                initCanvasFallback();
            }
        } else {
            console.log('[NIGHT SKY] Libraries not available - using fallback');
            console.log('[NIGHT SKY] Missing:', !libs.d3Available ? 'D3' : '', !libs.celestialAvailable ? 'Celestial' : '');
            useFallback = true;
            initCanvasFallback();
        }
    }

    /**
     * Wait for libraries and DOM
     */
    let checkAttempts = 0;
    const maxAttempts = 50;
    
    function checkAndInit() {
        checkAttempts++;
        console.log('[NIGHT SKY] Check attempt', checkAttempts, '/', maxAttempts);
        console.log('[NIGHT SKY] DOM ready:', document.readyState);
        console.log('[NIGHT SKY] D3 loaded:', typeof d3 !== 'undefined');
        console.log('[NIGHT SKY] Celestial loaded:', typeof Celestial !== 'undefined');
        
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            if (typeof d3 !== 'undefined' && typeof Celestial !== 'undefined') {
                console.log('[NIGHT SKY] All ready - initializing now!');
                init();
            } else if (checkAttempts >= maxAttempts) {
                console.log('[NIGHT SKY] Max attempts reached - initializing with fallback');
                useFallback = true;
                init();
            } else {
                console.log('[NIGHT SKY] Waiting for libraries... (will retry)');
                setTimeout(checkAndInit, 100);
            }
        } else {
            console.log('[NIGHT SKY] Waiting for DOM... (will retry)');
            setTimeout(checkAndInit, 100);
        }
    }

    // Start the check process
    console.log('[NIGHT SKY] Starting initialization check loop...');
    checkAndInit();

    console.log('[NIGHT SKY] Script loaded and check scheduled');
})();
