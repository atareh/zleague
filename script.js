// Seamless Video Loop Controller
class VideoLoopController {
    constructor(videoElement) {
        this.video = videoElement;
        this.init();
    }
    
    init() {
        console.log('Initializing video loop...');
        console.log('Video source:', this.video.src || this.video.querySelector('source')?.src);
        
        // Set video properties
        this.video.muted = true;
        this.video.loop = true; // Use native loop for now
        this.video.autoplay = true;
        
        // Show video immediately
        this.video.style.opacity = '1';
        
        // Try to start playback
        this.video.addEventListener('loadeddata', () => {
            console.log('Video loaded, starting playback...');
            this.startPlayback();
        });
        
        // Debug events
        this.video.addEventListener('play', () => console.log('Video started playing'));
        this.video.addEventListener('pause', () => console.log('Video paused'));
        this.video.addEventListener('ended', () => console.log('Video ended'));
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            console.error('Video error details:', this.video.error);
        });
        this.video.addEventListener('loadstart', () => console.log('Video load started'));
        this.video.addEventListener('canplay', () => console.log('Video can play'));
        this.video.addEventListener('canplaythrough', () => console.log('Video can play through'));
        
        // Try immediate playback
        this.startPlayback();
    }
    
    startPlayback() {
        this.video.play().then(() => {
            console.log('Video playback started successfully');
        }).catch(e => {
            console.log('Autoplay failed:', e);
            this.createPlayButton();
        });
    }
    
    createPlayButton() {
        console.log('Creating play button due to autoplay failure');
        
        const playButton = document.createElement('div');
        playButton.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 20px;
                border-radius: 10px;
                cursor: pointer;
                z-index: 1000;
                font-family: Arial;
            ">
                Click to Play Video
            </div>
        `;
        
        document.body.appendChild(playButton);
        
        playButton.addEventListener('click', () => {
            this.video.play();
            playButton.remove();
        });
    }
}

// Simple initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, looking for video...');
    
    const video = document.getElementById('background-video');
    if (video) {
        console.log('Video element found');
        new VideoLoopController(video);
    } else {
        console.error('Video element not found!');
    }
});

// Debug: Log when script loads
console.log('Script loaded');