/**
 * 360° Rotating Milky Way Galaxy Background
 * Creates an immersive space environment with slow rotation
 */

(function() {
    'use strict';

    let scene, camera, renderer, sphere;
    let animationId;

    // Configuration
    const CONFIG = {
        rotationSpeed: 0.0002,  // Very slow rotation
        starCount: 2000,
        fov: 75
    };

    /**
     * Initialize Three.js scene
     */
    function init() {
        const container = document.getElementById('galaxy-container');
        
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(
            CONFIG.fov,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 0);
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Create starfield with gradient (simulating Milky Way)
        createGalaxyBackground();
        
        // Add particle stars for depth
        createStarField();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
        
        // Start animation
        animate();
        
        console.log('360° Milky Way galaxy initialized');
    }

    /**
     * Create the main galaxy sphere with procedural Milky Way texture
     */
    function createGalaxyBackground() {
        // Create canvas texture for Milky Way
        const canvas = document.createElement('canvas');
        canvas.width = 4096;
        canvas.height = 2048;
        const ctx = canvas.getContext('2d');
        
        // Create space background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000814');
        gradient.addColorStop(0.3, '#001d3d');
        gradient.addColorStop(0.5, '#003566');
        gradient.addColorStop(0.7, '#001d3d');
        gradient.addColorStop(1, '#000814');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add Milky Way band
        const milkyWayGradient = ctx.createLinearGradient(0, canvas.height * 0.3, 0, canvas.height * 0.7);
        milkyWayGradient.addColorStop(0, 'rgba(88, 66, 124, 0)');
        milkyWayGradient.addColorStop(0.2, 'rgba(139, 92, 246, 0.3)');
        milkyWayGradient.addColorStop(0.4, 'rgba(168, 85, 247, 0.5)');
        milkyWayGradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.6)');
        milkyWayGradient.addColorStop(0.6, 'rgba(168, 85, 247, 0.5)');
        milkyWayGradient.addColorStop(0.8, 'rgba(139, 92, 246, 0.3)');
        milkyWayGradient.addColorStop(1, 'rgba(88, 66, 124, 0)');
        
        ctx.fillStyle = milkyWayGradient;
        ctx.fillRect(0, canvas.height * 0.3, canvas.width, canvas.height * 0.4);
        
        // Add nebula clouds
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = canvas.height * 0.4 + Math.random() * canvas.height * 0.2;
            const radius = Math.random() * 200 + 100;
            const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            
            const colors = [
                'rgba(139, 92, 246, 0.2)',
                'rgba(236, 72, 153, 0.15)',
                'rgba(59, 130, 246, 0.2)',
                'rgba(168, 85, 247, 0.2)'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            nebulaGradient.addColorStop(0, color);
            nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = nebulaGradient;
            ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
        
        // Add bright stars to texture
        for (let i = 0; i < 3000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 2 + 0.5;
            const brightness = Math.random() * 0.8 + 0.2;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.fill();
            
            // Add glow to some stars
            if (Math.random() > 0.95) {
                const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
                glowGradient.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.3})`);
                glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(x, y, size * 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        
        // Create sphere geometry (inside-out)
        const geometry = new THREE.SphereGeometry(500, 64, 64);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });
        
        sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
    }

    /**
     * Create floating particle stars for depth
     */
    function createStarField() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        for (let i = 0; i < CONFIG.starCount; i++) {
            // Random position in sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const radius = Math.random() * 400 + 50;
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            vertices.push(x, y, z);
            
            // Varied star colors (mostly white, some colored)
            const colorChoice = Math.random();
            if (colorChoice > 0.95) {
                colors.push(0.7, 0.5, 1); // Purple
            } else if (colorChoice > 0.9) {
                colors.push(0.5, 0.7, 1); // Blue
            } else {
                const brightness = Math.random() * 0.3 + 0.7;
                colors.push(brightness, brightness, brightness); // White
            }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const stars = new THREE.Points(geometry, material);
        scene.add(stars);
    }

    /**
     * Animation loop
     */
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        // Slowly rotate the galaxy sphere
        if (sphere) {
            sphere.rotation.y += CONFIG.rotationSpeed;
        }
        
        // Slight camera rotation for depth
        camera.rotation.y = Math.sin(Date.now() * 0.00005) * 0.05;
        
        renderer.render(scene, camera);
    }

    /**
     * Handle window resize
     */
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Cleanup on page unload
     */
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        if (renderer) {
            renderer.dispose();
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

