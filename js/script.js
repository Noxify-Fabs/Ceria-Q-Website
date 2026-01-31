// Global Variables
let currentPart = 1;
let currentPage = 1;
let totalPages = 5;
let audioPlayer = null;
let isAudioPlaying = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Show loading overlay
    showLoadingOverlay();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentPart = parseInt(urlParams.get('part')) || 1;
    currentPage = parseInt(urlParams.get('page')) || 1;
    
    // Initialize story page
    if (window.location.pathname.includes('story.html')) {
        initializeStoryPage();
    }
    
    // Smooth scrolling for navigation links
    initializeSmoothScrolling();
    
    // Add hover effects to cards
    initializeCardEffects();
    
    // Hide loading overlay after page is ready
    setTimeout(() => {
        hideLoadingOverlay();
    }, 1500);
});

// Initialize story page
function initializeStoryPage() {
    // Get story data
    const storyPart = getStoryPart(currentPart);
    totalPages = storyPart ? storyPart.totalPages : 10;
    
    // Show loading
    showLoading();
    
    // Load first page
    setTimeout(() => {
        loadPage(currentPage);
        hideLoading();
    }, 500);
    
    // Initialize audio player
    audioPlayer = document.getElementById('audio-player');
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Load specific page
function loadPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    currentPage = pageNumber;
    const pageData = getPage(currentPart, currentPage);
    
    if (!pageData) return;
    
    // Update page content with animation
    updatePageContent(pageData);
    
    // Update progress
    updateProgress();
    
    // Update URL
    updateURL();
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Update page content with animation
function updatePageContent(pageData) {
    const storyContent = document.querySelector('.story-content');
    
    // Add fade out effect
    storyContent.style.opacity = '0';
    storyContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        // Update content
        document.getElementById('story-title').textContent = pageData.title;
        document.getElementById('story-text').textContent = pageData.text;
        
        // Update illustration with SVG image
        const illustrationPlaceholder = document.querySelector('.illustration-placeholder');
        if (pageData.illustrationSvg) {
            illustrationPlaceholder.innerHTML = `<img src="${pageData.illustrationSvg}" alt="Illustration" style="max-width: 100%; height: auto;">`;
        } else {
            illustrationPlaceholder.textContent = pageData.illustration;
        }
        
        // Update media sources
        updateMediaSources(pageData);
        
        // Fade in effect
        storyContent.style.opacity = '1';
        storyContent.style.transform = 'translateY(0)';
    }, 300);
}

// Update media sources
function updateMediaSources(pageData) {
    if (audioPlayer && pageData.audio) {
        audioPlayer.src = pageData.audio;
    }
    
    const videoPlayer = document.getElementById('video-player');
    if (videoPlayer && pageData.video) {
        videoPlayer.src = pageData.video;
    }
}

// Update progress bar
function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = (currentPage / totalPages) * 100;
    progressFill.style.width = progressPercent + '%';
    
    // Update page indicators
    document.getElementById('current-page').textContent = `Halaman ${currentPage}`;
    document.getElementById('total-pages').textContent = `dari ${totalPages}`;
    document.getElementById('page-number').textContent = `${currentPage} / ${totalPages}`;
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Disable/enable previous button
    if (currentPage <= 1) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
    
    // Disable/enable next button
    if (currentPage >= totalPages) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
}

// Navigation functions
function previousPage() {
    if (currentPage > 1) {
        loadPage(currentPage - 1);
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        loadPage(currentPage + 1);
    }
}

// Media functions
function toggleAudio() {
    const modal = document.getElementById('audio-modal');
    modal.style.display = 'flex';
    
    // Try to play audio
    if (audioPlayer && audioPlayer.src) {
        audioPlayer.play().catch(e => {
            console.log('Audio play failed:', e);
        });
    }
}

function toggleVideo() {
    const videoSection = document.getElementById('video-section');
    const videoPlayer = document.getElementById('video-player');
    const videoBtn = document.getElementById('video-btn');
    
    // Get current page video URL
    const pageData = getPage(currentPart, currentPage);
    
    if (videoSection.style.display === 'none' || !videoSection.style.display) {
        // Show video section
        videoSection.style.display = 'block';
        
        // Set video source with autoplay parameters
        if (pageData && pageData.video) {
            const videoId = pageData.video.split('embed/')[1];
            const autoplayUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
            videoPlayer.src = autoplayUrl;
        }
        
        // Update button text
        videoBtn.querySelector('.media-text').textContent = 'Tutup Video';
        videoBtn.querySelector('.media-icon').textContent = '❌';
        
        // Scroll to video
        setTimeout(() => {
            videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    } else {
        // Hide video section
        videoSection.style.display = 'none';
        videoPlayer.src = '';
        
        // Update button text
        videoBtn.querySelector('.media-text').textContent = 'Video/Animasi';
        videoBtn.querySelector('.media-icon').textContent = '🎬';
    }
}

function closeAudioModal() {
    const modal = document.getElementById('audio-modal');
    modal.style.display = 'none';
    
    // Pause audio
    if (audioPlayer) {
        audioPlayer.pause();
    }
}

// Open story from index page
function openStory(partNumber) {
    window.location.href = `story.html?part=${partNumber}&page=1`;
}

// Mobile menu functionality
function initializeMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Loading overlay functions
function showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// Loading functions
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'flex';
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Update URL without page reload
function updateURL() {
    const url = new URL(window.location);
    url.searchParams.set('page', currentPage);
    window.history.replaceState({}, '', url);
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Set initial active state based on scroll position
    updateActiveOnScroll();
}

// Update active navigation link
function updateActiveNavLink(targetId) {
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${targetId}`) {
            link.classList.add('active');
        }
    });
}

// Update active state on scroll
function updateActiveOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            updateActiveNavLink(id);
        }
    });
}

// Listen for scroll events
window.addEventListener('scroll', updateActiveOnScroll);

// Card hover effects
function initializeCardEffects() {
    const cards = document.querySelectorAll('.story-card, .about-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (!window.location.pathname.includes('story.html')) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            previousPage();
            break;
        case 'ArrowRight':
            nextPage();
            break;
        case 'Escape':
            closeAudioModal();
            // Close video section if open
            const videoSection = document.getElementById('video-section');
            if (videoSection.style.display === 'block') {
                toggleVideo();
            }
            break;
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    if (!window.location.pathname.includes('story.html')) return;
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    if (!window.location.pathname.includes('story.html')) return;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) < swipeThreshold) return;
    
    if (diff > 0) {
        // Swipe left - next page
        nextPage();
    } else {
        // Swipe right - previous page
        previousPage();
    }
}

// Modal click outside to close
document.addEventListener('click', function(e) {
    const audioModal = document.getElementById('audio-modal');
    
    if (e.target === audioModal) {
        closeAudioModal();
    }
});

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        // Add scrolled class for enhanced styling
        navbar.classList.add('scrolled');
        navbar.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)';
        navbar.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Add CSS transitions dynamically
const style = document.createElement('style');
style.textContent = `
    .story-content {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .navbar {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);

// Error handling for media
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'AUDIO' || e.target.tagName === 'IFRAME') {
        console.log('Media loading error:', e.target.src);
        // Could show user-friendly message here
    }
}, true);

// Performance optimization - preload next page
function preloadNextPage() {
    if (currentPage < totalPages) {
        const nextPageData = getPage(currentPart, currentPage + 1);
        if (nextPageData && nextPageData.audio) {
            const audio = new Audio();
            audio.src = nextPageData.audio;
            audio.preload = 'auto';
        }
    }
}

// Call preload after page load
setTimeout(preloadNextPage, 1000);
