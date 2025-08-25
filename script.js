// Video Loop Controller
class VideoLoopController {
    constructor(videoElement) {
        this.video = videoElement;
        this.isReversing = false;
        this.playbackRate = 1;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for video metadata to load
        this.video.addEventListener('loadedmetadata', () => {
            this.setupInfiniteLoop();
            this.isInitialized = true;
        });
        
        // Error handling
        this.video.addEventListener('error', (e) => {
            console.warn('Video failed to load:', e);
            this.handleVideoError();
        });
        
        // When video can start playing
        this.video.addEventListener('canplay', () => {
            this.video.classList.add('loaded');
            this.hideLoadingScreen();
        });
    }
    
    setupInfiniteLoop() {
        // Set initial playback rate
        this.video.playbackRate = this.playbackRate;
        
        // Start playing
        this.video.play().catch(e => {
            console.warn('Autoplay failed:', e);
            this.handleAutoplayFailure();
        });
        
        // Listen for when video reaches the end
        this.video.addEventListener('timeupdate', () => {
            this.handleTimeUpdate();
        });
    }
    
    handleTimeUpdate() {
        const currentTime = this.video.currentTime;
        const duration = this.video.duration;
        
        if (!this.isReversing) {
            // Forward playback - check if we're near the end
            if (currentTime >= duration - 0.1) {
                this.startReverse();
            }
        } else {
            // Reverse playback - check if we're near the beginning
            if (currentTime <= 0.1) {
                this.startForward();
            }
        }
    }
    
    startReverse() {
        this.isReversing = true;
        this.video.playbackRate = -1;
        console.log('Starting reverse playback');
    }
    
    startForward() {
        this.isReversing = false;
        this.video.playbackRate = 1;
        console.log('Starting forward playback');
    }
    
    handleVideoError() {
        console.error('Video error - creating fallback');
        this.createFallbackBackground();
    }
    
    handleAutoplayFailure() {
        // Create a play button overlay
        this.createPlayButton();
    }
    
    createPlayButton() {
        const playButton = document.createElement('div');
        playButton.innerHTML = `
            <div class="play-button-overlay">
                <button class="play-button">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span>Click to Play</span>
                </button>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .play-button-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                cursor: pointer;
            }
            .play-button {
                display: flex;
                flex-direction: column;
                align-items: center;
                background: rgba(255, 107, 107, 0.9);
                border: none;
                border-radius: 50px;
                padding: 20px 30px;
                color: white;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .play-button:hover {
                background: rgba(255, 107, 107, 1);
                transform: scale(1.1);
            }
            .play-button svg {
                margin-bottom: 10px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(playButton);
        
        playButton.addEventListener('click', () => {
            this.video.play().then(() => {
                playButton.remove();
                style.remove();
            });
        });
    }
    
    createFallbackBackground() {
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            z-index: -1;
        `;
        document.body.appendChild(fallback);
        this.hideLoadingScreen();
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 1000);
            }, 1500);
        }
    }
}

// Enhanced Loading and Initialization
class SiteLoader {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.video = document.getElementById('background-video');
        this.isLoaded = false;
        
        this.init();
    }
    
    init() {
        // Initialize video controller
        if (this.video) {
            this.videoController = new VideoLoopController(this.video);
        } else {
            console.warn('Video element not found');
            this.createFallbackAndHideLoading();
        }
        
        // Initialize other components
        this.initializeAnimations();
        this.initializeInteractions();
    }
    
    initializeAnimations() {
        // Animate elements on load
        const animatedElements = document.querySelectorAll('.hero-content, .cta-section');
        animatedElements.forEach((el, index) => {
            el.style.animationDelay = `${0.5 + index * 0.3}s`;
        });
    }
    
    initializeInteractions() {
        // Add interactive effects
        const buttons = document.querySelectorAll('.cta-button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
            
            // Add ripple effect
            button.addEventListener('mousedown', (e) => {
                this.createRipple(e);
            });
        });
        
        // Logo interaction
        const logo = document.querySelector('.main-logo');
        if (logo) {
            logo.addEventListener('click', () => {
                this.handleLogoClick();
            });
        }
    }
    
    handleButtonClick(button) {
        const buttonText = button.textContent.trim();
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Handle different button actions
        if (buttonText.includes('Join')) {
            console.log('Join the League clicked');
            // Add your join logic here
        } else if (buttonText.includes('Learn')) {
            console.log('Learn More clicked');
            // Add your learn more logic here
        }
    }
    
    createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
        `;
        
        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.querySelector('[data-ripple-style]')) {
            style.setAttribute('data-ripple-style', '');
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    handleLogoClick() {
        const logo = document.querySelector('.main-logo');
        logo.style.animation = 'none';
        setTimeout(() => {
            logo.style.animation = 'spin 1s ease-in-out';
        }, 10);
        
        setTimeout(() => {
            logo.style.animation = '';
        }, 1000);
    }
    
    createFallbackAndHideLoading() {
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            z-index: -1;
        `;
        document.body.appendChild(fallback);
        
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('hidden');
            }
        }, 2000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SiteLoader();
});

// Handle visibility changes (for better performance)
document.addEventListener('visibilitychange', () => {
    const video = document.getElementById('background-video');
    if (video) {
        if (document.hidden) {
            video.pause();
        } else {
            video.play().catch(e => console.log('Resume playback failed:', e));
        }
    }
});
