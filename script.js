// WhatsApp Link Handler
function openWhatsApp(ucAmount) {
    const phoneNumber = '+923295484764'; // Updated to correct number
    const message = `I want to buy ${ucAmount} UC from REHAN Carder. My UID: _____`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

// Customer Reviews System
class ReviewSystem {
    constructor() {
        this.reviews = this.loadReviews();
        this.init();
    }

    init() {
        this.renderReviews();
        this.bindEvents();
    }

    loadReviews() {
        const saved = localStorage.getItem('rehanCarderReviews');
        return saved ? JSON.parse(saved) : [];
    }

    saveReviews() {
        localStorage.setItem('rehanCarderReviews', JSON.stringify(this.reviews));
    }

    addReview(review) {
        const newReview = {
            ...review,
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        
        this.reviews.unshift(newReview);
        this.saveReviews();
        this.renderReviews();
    }

    renderReviews() {
        const container = document.getElementById('reviewsContainer');
        
        if (this.reviews.length === 0) {
            container.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-star-half-alt" style="font-size: 3rem; color: #ffd700; margin-bottom: 1rem;"></i>
                    <p style="text-align: center; color: rgba(255,255,255,0.7); font-size: 1.2rem;">
                        Be the first to leave a review!
                    </p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-name">${review.name}</span>
                    <span class="review-rating">${'⭐'.repeat(parseInt(review.rating))}</span>
                </div>
                <p class="review-message">${review.message}</p>
                <div class="review-date">${review.date}</div>
            </div>
        `).join('');
    }

    bindEvents() {
        const form = document.getElementById('reviewForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleReviewSubmit();
            });
        }
    }

    handleReviewSubmit() {
        const nameInput = document.getElementById('reviewerName');
        const ratingSelect = document.getElementById('reviewRating');
        const messageTextarea = document.getElementById('reviewMessage');

        const review = {
            name: nameInput.value.trim(),
            rating: ratingSelect.value,
            message: messageTextarea.value.trim()
        };

        if (!review.name || !review.rating || !review.message) {
            this.showNotification('Please fill all fields!', 'error');
            return;
        }

        this.addReview(review);
        
        // Reset form
        nameInput.value = '';
        ratingSelect.value = '';
        messageTextarea.value = '';

        this.showNotification('Thank you for your review!', 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            color: 'white',
            fontSize: '1.1rem',
            zIndex: '1000',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        if (type === 'success') {
            notification.style.background = 'linear-gradient(45deg, #25d366, #128c7e)';
        } else {
            notification.style.background = 'linear-gradient(45deg, #ff4757, #ff3838)';
        }

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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize review system
    const reviewSystem = new ReviewSystem();

    // Add click handlers for bundle cards
    document.querySelectorAll('.bundle-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('buy-btn')) {
                const amount = card.dataset.amount;
                openWhatsApp(amount);
            }
        });
    });

    // Add smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.1s';
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.bundle-card, .review-item').forEach(el => {
        observer.observe(el);
    });
});

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US').format(amount);
}

function getCurrentYear() {
    return new Date().getFullYear();
}

// Add some sample reviews on first load
function addSampleReviews() {
    const hasReviews = localStorage.getItem('rehanCarderReviews');
    if (!hasReviews) {
        const sampleReviews = [
            {
                name: "Ahmed Khan",
                rating: "5",
                message: "Excellent service! Got my 50K UC instantly. Very trustworthy seller.",
                id: 1,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            },
            {
                name: "Sarah Ali",
                rating: "5",
                message: "Best UC prices in the market. Quick delivery and great support!",
                id: 2,
                date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }
        ];
        
        localStorage.setItem('rehanCarderReviews', JSON.stringify(sampleReviews));
    }
}

// Initialize sample reviews
addSampleReviews();
