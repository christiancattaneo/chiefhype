/**
 * Main JavaScript - Handles lazy video loading and interactions
 * Implements Intersection Observer for efficient video loading
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        rootMargin: '50px',
        threshold: 0.1,
        videoOptions: {
            preload: 'metadata',
            playbackRate: 1.0
        }
    };

    // State management
    const state = {
        loadedVideos: new Set(),
        observers: new Map()
    };

    /**
     * Initialize application
     */
    function init() {
        // Check browser support
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, loading all videos');
            loadAllVideos();
            return;
        }

        setupLazyLoading();
        setupVideoInteractions();
        setupErrorHandling();
        
        console.log('Portfolio initialized successfully');
    }

    /**
     * Setup lazy loading for videos using Intersection Observer
     */
    function setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: CONFIG.rootMargin,
            threshold: CONFIG.threshold
        };

        const observer = new IntersectionObserver(handleIntersection, options);
        state.observers.set('video', observer);

        // Observe all lazy videos
        const lazyVideos = document.querySelectorAll('.lazy-video');
        lazyVideos.forEach(video => {
            observer.observe(video);
        });

        console.log(`Observing ${lazyVideos.length} videos for lazy loading`);
    }

    /**
     * Handle intersection events for lazy loading
     */
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                loadVideo(video);
                observer.unobserve(video);
            }
        });
    }

    /**
     * Load a single video
     */
    function loadVideo(video) {
        const videoId = video.dataset.index || video.closest('[data-index]')?.dataset.index;
        
        // Prevent duplicate loading
        if (state.loadedVideos.has(videoId)) {
            return;
        }

        const src = video.dataset.src;
        
        if (!src) {
            console.warn('Video missing data-src attribute', video);
            return;
        }

        // Create source element
        const source = document.createElement('source');
        source.src = src;
        source.type = 'video/mp4';
        
        // Handle load events
        video.addEventListener('loadeddata', () => {
            handleVideoLoaded(video, videoId);
        }, { once: true });

        video.addEventListener('error', (e) => {
            handleVideoError(video, videoId, e);
        }, { once: true });

        // Append source and load
        video.appendChild(source);
        video.load();
        
        console.log(`Loading video ${videoId}:`, src);
    }

    /**
     * Handle successful video load
     */
    function handleVideoLoaded(video, videoId) {
        video.classList.add('loaded');
        state.loadedVideos.add(videoId);
        
        // Auto-play with error handling
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log(`Video ${videoId} playing`);
                })
                .catch(error => {
                    console.warn(`Autoplay prevented for video ${videoId}:`, error.message);
                    // Add play button overlay if autoplay fails
                    addPlayButton(video);
                });
        }
    }

    /**
     * Handle video loading errors
     */
    function handleVideoError(video, videoId, error) {
        console.error(`Error loading video ${videoId}:`, error);
        
        // Show error state
        const overlay = video.nextElementSibling;
        if (overlay && overlay.classList.contains('video-overlay')) {
            const loader = overlay.querySelector('.loader');
            if (loader) {
                loader.innerHTML = '⚠️';
                loader.style.border = 'none';
                loader.style.fontSize = '2rem';
            }
        }
    }

    /**
     * Add manual play button for videos where autoplay is prevented
     */
    function addPlayButton(video) {
        const overlay = video.nextElementSibling;
        if (!overlay || !overlay.classList.contains('video-overlay')) {
            return;
        }

        const playBtn = document.createElement('button');
        playBtn.className = 'play-button';
        playBtn.innerHTML = '▶️';
        playBtn.setAttribute('aria-label', 'Play video');
        
        playBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 243, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
        `;

        playBtn.addEventListener('click', () => {
            video.play();
            overlay.style.opacity = '0';
            playBtn.remove();
        });

        overlay.appendChild(playBtn);
        overlay.style.opacity = '0.8';
        overlay.style.pointerEvents = 'all';
    }

    /**
     * Setup video interaction handlers
     */
    function setupVideoInteractions() {
        const videos = document.querySelectorAll('.app-video');
        
        videos.forEach(video => {
            const card = video.closest('.app-card');
            
            if (!card) return;

            // Pause video when card is out of view
            const pauseObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting && !video.paused) {
                        video.pause();
                    } else if (entry.isIntersecting && video.paused && video.readyState >= 2) {
                        video.play().catch(e => console.log('Play prevented:', e.message));
                    }
                });
            }, { threshold: 0.5 });

            pauseObserver.observe(card);
            state.observers.set(`pause-${video.dataset.index}`, pauseObserver);
        });
    }

    /**
     * Setup global error handling
     */
    function setupErrorHandling() {
        window.addEventListener('error', (event) => {
            if (event.target.tagName === 'VIDEO') {
                console.error('Video error:', event.target.src, event);
            }
        }, true);
    }

    /**
     * Load all videos immediately (fallback for unsupported browsers)
     */
    function loadAllVideos() {
        const videos = document.querySelectorAll('.lazy-video');
        videos.forEach(loadVideo);
    }

    /**
     * Cleanup observers on page unload
     */
    function cleanup() {
        state.observers.forEach(observer => observer.disconnect());
        state.observers.clear();
        state.loadedVideos.clear();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on unload
    window.addEventListener('beforeunload', cleanup);
})();

