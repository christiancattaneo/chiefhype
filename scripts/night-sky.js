/**
 * Real Night Sky Simulation
 * Uses D3-Celestial with actual star catalog data
 * Shows accurate sky rotation and Milky Way progression
 */

(function() {
    'use strict';

    // Configuration for realistic night sky
    const config = {
        width: 0,  // 0 = full width
        projection: "aitoff",  // Aitoff projection for full sky view
        transform: "equatorial",  // Equatorial coordinates
        center: null,  // Auto-center
        orientationfixed: false,  // Allow rotation
        geopos: [0, 40],  // Latitude/longitude (40°N for good Milky Way view)
        follow: "zenith",  // Follow zenith (what's overhead)
        zoomlevel: null,  // No zoom
        zoomextend: 1,
        adaptable: true,  // Resize with window
        interactive: false,  // Disable user interaction for background
        form: false,  // Hide configuration form
        location: false,  // Hide location
        formFields: {
            "location": false,
            "general": false,
            "stars": false,
            "dsos": false,
            "constellations": false,
            "lines": false,
            "other": false,
            "download": false
        },
        
        // Background - pure black
        background: {
            fill: "#000000",
            opacity: 1,
            stroke: "#000000",
            width: 0
        },
        
        // Stars configuration - realistic
        stars: {
            show: true,
            limit: 6,  // Show stars up to magnitude 6 (naked eye limit)
            colors: false,  // White stars only
            style: { fill: "#ffffff", opacity: 1 },
            designation: false,  // No labels
            designationStyle: { fill: "#ffffff", opacity: 0 },
            designationLimit: 20,
            propername: false,
            propernameLimit: 1.5,
            size: 5,  // Base star size
            exponent: -0.28,  // How much size varies with magnitude
            data: "stars.6.json"  // Star catalog (loads from CDN)
        },
        
        // Deep sky objects (DSOs) - hide
        dsos: {
            show: false
        },
        
        // Constellations - hide for clean look
        constellations: {
            show: false,
            names: false,
            lines: false,
            bounds: false
        },
        
        // Milky Way - show prominently in white/gray
        mw: {
            show: true,  // Show Milky Way
            style: { fill: "#ffffff", opacity: 0.15 }  // Subtle white Milky Way
        },
        
        // Grid lines - hide
        lines: {
            graticule: { show: false },
            equatorial: { show: false },
            ecliptic: { show: false },
            galactic: { show: false },
            supergalactic: { show: false }
        },
        
        // Planets - hide
        planets: {
            show: false
        }
    };

    let timeSpeed = 120;  // Speed multiplier (120x = 2 minutes of real time per second)
    let currentTime = new Date();
    let animationRunning = true;

    /**
     * Initialize the celestial map
     */
    function init() {
        // Set initial time to show Milky Way prominently
        // Set to ~2 AM local time for best Milky Way visibility
        currentTime = new Date();
        currentTime.setHours(2, 0, 0, 0);
        
        // Initialize D3-Celestial
        Celestial.display(config);
        
        // Start animation
        animate();
        
        console.log('Real night sky initialized - Stars rotate around Polaris');
        console.log('Milky Way will shift across sky as time progresses');
    }

    /**
     * Animation loop - progress time to show sky rotation
     */
    function animate() {
        if (!animationRunning) return;
        
        // Advance time
        currentTime = new Date(currentTime.getTime() + (1000 * timeSpeed));
        
        // Update celestial display with new time
        Celestial.date(currentTime);
        
        // Redraw with new positions
        Celestial.redraw();
        
        // Continue animation
        setTimeout(animate, 100);  // Update 10 times per second
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        Celestial.resize();
    }

    // Initialize when Celestial is loaded
    if (typeof Celestial !== 'undefined') {
        init();
    } else {
        // Wait for Celestial to load
        window.addEventListener('load', init);
    }

    // Handle resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    window.addEventListener('beforeunload', () => {
        animationRunning = false;
    });
})();

