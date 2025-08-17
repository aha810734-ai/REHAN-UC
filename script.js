// WhatsApp Link Function
function openWhatsApp(ucAmount) {
    const message = `I want to buy ${ucAmount} UC from REHAN Carder. My UID: _____`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/923295484764?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Review Management
class ReviewManager {
    constructor() {
        this.reviews = this.loadReviews();
        this.displayReviews();
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
            name: name,
            rating: rating,
            message: message,
            date: new Date().toLocaleDateString()
        };
        
        this.reviews.unshift(review);
        this.saveReviews();
        this.displayReviews();
    }

    displayReviews() {
        const container = document.getElementById('reviewsContainer');
        container.innerHTML = '';

        if (this.reviews.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7);">No reviews yet. Be the first to leave a review!</p>';
            return;
        }

        this.reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review-item';
            reviewDiv.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name">${this.escapeHtml(review.name)}</span>
                    <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                </div>
                <div class="review-message">${this.escapeHtml(review.message)}</div>
            `;
            container.appendChild(reviewDiv);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize Review Manager
const reviewManager = new ReviewManager();

// Add Review Function
function addReview(event) {
    event.preventDefault();
    
    const name = document.getElementById('reviewerName').value.trim();
    const rating = document.getElementById('reviewRating').value;
    const message = document.getElementById('reviewMessage').value.trim();
    
    if (name && rating && message) {
        reviewManager.addReview(name, parseInt(rating), message);
        
        // Clear form
        document.getElementById('reviewerName').value = '';
        document.getElementById('reviewRating').value = '';
        document.getElementById('reviewMessage').value = '';
        
        // Show success message
        showNotification('Review added successfully!');
    }
}

// Notification Function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Add click event to bundle cards
document.addEventListener('DOMContentLoaded', function() {
    const bundleCards = document.querySelectorAll('.bundle-card');
    bundleCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('buy-btn')) return;
            const ucAmount = this.getAttribute('data-uc');
            openWhatsApp(ucAmount);
        });
    });
});

// Smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
