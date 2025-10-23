/**
 * Real Night Sky with D3-Celestial
 * Uses actual star catalog data with proper rotation and time progression
 * Extensive logging for debugging
 */

(function() {
    'use strict';

    console.log('[NIGHT SKY] Script loading...');
    console.log('[NIGHT SKY] D3 available:', typeof d3 !== 'undefined');
    console.log('[NIGHT SKY] Celestial available:', typeof Celestial !== 'undefined');

    let timeSpeed = 120; // Speed multiplier (120x real-time)
    let currentTime = new Date();
    let animationRunning = false;
    let animationInterval;

    /**
     * Configuration for D3-Celestial
     */
    const config = {
        container: 'celestial-map',
        datapath: 'https://ofrohn.github.io/d3-celestial/data/',
        width: 0, // 0 = full width
        projection: 'aitoff', // Aitoff projection for wide view
        transform: 'equatorial', // Equatorial coordinates
        center: null, // Auto-center
        orientationfixed: false, // Allow rotation
        geopos: [0, 40], // Latitude 40°N for good Milky Way view
        follow: 'zenith', // Follow zenith
        zoomlevel: null,
        zoomextend: 1,
        adaptable: true,
        interactive: false, // Disable user interaction
        form: false, // Hide form
        location: false, // Hide location widget
        controls: false, // Hide controls
        
        // Background - pure black
        background: {
            fill: '#000000',
            opacity: 1,
            stroke: '#000000',
            width: 0
        },
        
        // Stars configuration
        stars: {
            show: true,
            limit: 6, // Magnitude limit (naked eye)
            colors: false, // White stars only
            style: { fill: '#ffffff', opacity: 1 },
            designation: false, // No star labels
            propername: false, // No star names
            size: 5,
            exponent: -0.28,
            data: 'stars.6.json'
        },
        
        // Deep sky objects - hide
        dsos: {
            show: false,
            limit: 6
        },
        
        // Constellations - hide for clean look
        constellations: {
            show: false,
            names: false,
            desig: false,
            lines: false,
            bounds: false
        },
        
        // Milky Way - show in white/gray
        mw: {
            show: true,
            style: { fill: '#ffffff', opacity: 0.15 }
        },
        
        // Grid lines - hide all
        lines: {
            graticule: { show: false },
            equatorial: { show: false },
            ecliptic: { show: false },
            galactic: { show: false },
            supergalactic: { show: false }
        },
        
        // Other objects - hide
        planets: { show: false },
        center: null,
        horizon: { show: false },
        daylight: { show: false }
    };

    /**
     * Initialize D3-Celestial
     */
    function init() {
        console.log('[NIGHT SKY] Initializing...');
        
        // Check if container exists
        const container = document.getElementById('celestial-map');
        if (!container) {
            console.error('[NIGHT SKY] ERROR: Container #celestial-map not found!');
            return;
        }
        console.log('[NIGHT SKY] Container found:', container);
        
        // Check if Celestial is available
        if (typeof Celestial === 'undefined') {
            console.error('[NIGHT SKY] ERROR: Celestial library not loaded!');
            return;
        }
        console.log('[NIGHT SKY] Celestial library loaded successfully');
        
        // Set initial time to 2 AM for best Milky Way visibility
        currentTime = new Date();
        currentTime.setHours(2, 0, 0, 0);
        console.log('[NIGHT SKY] Initial time set to:', currentTime.toString());
        
        try {
            console.log('[NIGHT SKY] Calling Celestial.display() with config:', config);
            
            // Display the celestial map
            Celestial.display(config);
            
            console.log('[NIGHT SKY] Celestial.display() completed');
            console.log('[NIGHT SKY] Map should now be visible');
            
            // Start time progression animation
            startAnimation();
            
        } catch (error) {
            console.error('[NIGHT SKY] ERROR during initialization:', error);
            console.error('[NIGHT SKY] Error stack:', error.stack);
        }
    }

    /**
     * Start the animation loop
     */
    function startAnimation() {
        if (animationRunning) {
            console.log('[NIGHT SKY] Animation already running');
            return;
        }
        
        animationRunning = true;
        console.log('[NIGHT SKY] Starting animation loop');
        console.log('[NIGHT SKY] Time speed: ' + timeSpeed + 'x');
        
        let frameCount = 0;
        
        animationInterval = setInterval(function() {
            // Advance time
            currentTime = new Date(currentTime.getTime() + (1000 * timeSpeed));
            
            // Log every 50 frames
            if (frameCount % 50 === 0) {
                console.log('[NIGHT SKY] Frame ' + frameCount + ' - Time:', currentTime.toString());
            }
            
            try {
                // Update celestial display with new time
                Celestial.date(currentTime);
                
                // Redraw
                Celestial.redraw();
                
            } catch (error) {
                console.error('[NIGHT SKY] ERROR during animation:', error);
            }
            
            frameCount++;
        }, 100); // Update 10 times per second
        
        console.log('[NIGHT SKY] Animation started successfully');
    }

    /**
     * Stop animation
     */
    function stopAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationRunning = false;
            console.log('[NIGHT SKY] Animation stopped');
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        console.log('[NIGHT SKY] Window resized');
        if (typeof Celestial !== 'undefined' && Celestial.resize) {
            Celestial.resize();
            console.log('[NIGHT SKY] Map resized');
        }
    }

    /**
     * Cleanup on page unload
     */
    function cleanup() {
        console.log('[NIGHT SKY] Cleaning up...');
        stopAnimation();
    }

    // Wait for libraries to load
    function checkAndInit() {
        console.log('[NIGHT SKY] Checking if libraries are ready...');
        console.log('[NIGHT SKY] - D3 loaded:', typeof d3 !== 'undefined');
        console.log('[NIGHT SKY] - Celestial loaded:', typeof Celestial !== 'undefined');
        console.log('[NIGHT SKY] - DOM ready:', document.readyState);
        
        if (typeof d3 !== 'undefined' && typeof Celestial !== 'undefined') {
            console.log('[NIGHT SKY] All dependencies loaded, initializing...');
            init();
        } else {
            console.log('[NIGHT SKY] Waiting for dependencies...');
            setTimeout(checkAndInit, 100);
        }
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        console.log('[NIGHT SKY] Waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', checkAndInit);
    } else {
        console.log('[NIGHT SKY] DOM already loaded');
        checkAndInit();
    }

    // Handle resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    window.addEventListener('beforeunload', cleanup);

    console.log('[NIGHT SKY] Script loaded successfully');
})();
