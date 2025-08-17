// WhatsApp Integration
function openWhatsApp(ucAmount) {
    const message = `I want to buy ${ucAmount} UC from REHAN Carder. My UID: _____`;
    const whatsappUrl = `https://wa.me/923295484764?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Review Management System
class ReviewManager {
    constructor() {
        this.reviews = this.loadReviews();
        this.init();
    }

    init() {
        this.renderReviews();
        this.bindEvents();
    }

    loadReviews() {
        const stored = localStorage.getItem('rehanCarderReviews');
        return stored ? JSON.parse(stored) : [];
    }

    saveReviews() {
        localStorage.setItem('rehanCarderReviews', JSON.stringify(this.reviews));
    }

    addReview(name, rating, message) {
        const review = {
            id: Date.now(),
            name: name.trim(),
            rating: parseInt(rating),
            message: message.trim(),
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        
        this.reviews.unshift(review);
        this.saveReviews();
        this.renderReviews();
    }

    renderReviews() {
        const container = document.getElementById('reviewsContainer');
        
        if (this.reviews.length === 0) {
            container.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-comments" style="font-size: 3rem; color: #666; margin-bottom: 1rem;"></i>
                    <p>No reviews yet. Be the first to leave a review!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="reviewer-name">${this.escapeHtml(review.name)}</span>
                    <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                </div>
                <p class="review-message">${this.escapeHtml(review.message)}</p>
                <div class="review-date">${review.date}</div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    bindEvents() {
        const form = document.getElementById('reviewForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleReviewSubmit();
        });
    }

    handleReviewSubmit() {
        const name = document.getElementById('reviewerName').value;
        const rating = document.getElementById('reviewRating').value;
        const message = document.getElementById('reviewMessage').value;

        if (!name || !rating || !message) {
            this.showNotification('Please fill all fields', 'error');
            return;
        }

        this.addReview(name, rating, message);
        
        // Reset form
        document.getElementById('reviewForm').reset();
        
        // Show success message
        this.showNotification('Thank you for your review!', 'success');
        
        // Scroll to reviews
        document.getElementById('reviewsContainer').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        notification.style.background = type === 'success' 
            ? 'linear-gradient(45deg, #25d366, #128c7e)' 
            : 'linear-gradient(45deg, #ff4757, #ff3838)';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Smooth scrolling for internal links
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Add click handlers to bundle cards
function addBundleCardHandlers() {
    const bundleCards = document.querySelectorAll('.bundle-card');
    bundleCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('buy-button')) {
                const ucAmount = this.dataset.uc;
                openWhatsApp(ucAmount);
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize review manager
    const reviewManager = new ReviewManager();
    
    // Add bundle card click handlers
    addBundleCardHandlers();
    
    // Add loading animation for images
    const images = document.querySelectorAll('.bundle-image');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe bundle cards
    document.querySelectorAll('.bundle-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}

// Prevent zoom on double tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add pull-to-refresh prevention
document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
        event.preventDefault();
    }
}, { passive: false });

// Handle network status
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
});
