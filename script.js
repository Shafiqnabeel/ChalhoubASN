// --- GLOBAL UTILITIES & INTERACTIVE COMPONENTS ---

document.addEventListener('DOMContentLoaded', () => {
    initReviewModal();
    initImageZoom();
});

/**
 * Handles the "Write a Review" Modal Logic
 */
function initReviewModal() {
    const modalHtml = `
        <div class="modal-overlay" id="reviewModal">
            <div class="modal-content">
                <button class="modal-close" id="closeReview">&times;</button>
                <h2>Share Your Feedback</h2>
                <p style="margin-bottom: 1.5rem; color: #64748b;">Help us improve the Inbound Logistics Portal. Your thoughts matter!</p>
                <form class="review-form" id="feedbackForm">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Full Name</label>
                    <input type="text" name="name" id="reviewerName" placeholder="Enter your name" required>
                    
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Your Review/Suggestions</label>
                    <textarea name="message" id="reviewText" placeholder="What could we add or improve?" required></textarea>
                    
                    <button type="submit" class="cta-button" id="submitBtn" style="width: 100%; border: none;">Submit Feedback</button>
                </form>
            </div>
        </div>
        
        <button class="review-btn" id="openReview">
            <span>✍️</span> Write a Review
        </button>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('reviewModal');
    const openBtn = document.getElementById('openReview');
    const closeBtn = document.getElementById('closeReview');
    const form = document.getElementById('feedbackForm');
    const submitBtn = document.getElementById('submitBtn');

    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('reviewerName').value;
        const submitOriginalText = submitBtn.innerText;

        // Visual Feedback: Loading State
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        const formData = new FormData(form);
        formData.append('_subject', `${name} Reviewed Your Website!`);

        try {
            const response = await fetch("https://formspree.io/f/mojnedgd", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show thank you message
                form.innerHTML = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                        <h3 style="color: var(--primary-blue); margin-bottom: 0.5rem;">Submitted!</h3>
                        <p style="color: #64748b;">Thank you, ${name}. Your feedback has been sent directly to Shafiq.</p>
                        <button type="button" class="cta-button" style="margin-top: 1.5rem; border: none;" onclick="location.reload()">Close</button>
                    </div>
                `;
            } else {
                throw new Error('Formspree response not ok');
            }
        } catch (error) {
            submitBtn.innerText = "Error - Try Again";
            submitBtn.disabled = false;
            alert("There was an issue sending your review. Please check your connection or try again later.");
        }
    });
}

/**
 * Handles professional image zooming/lightbox
 */
function initImageZoom() {
    const images = document.querySelectorAll('.step-image img');

    // Create lightbox overlay if it doesn't exist
    let lightbox = document.getElementById('globalLightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'globalLightbox';
        lightbox.className = 'modal-overlay';
        lightbox.style.backgroundColor = 'rgba(255, 255, 255, 0.6)'; // Light transparent background
        lightbox.style.backdropFilter = 'blur(4px)'; // Subtle blur to keep page visible
        lightbox.style.cursor = 'zoom-out';
        lightbox.innerHTML = `<img src="" style="max-width: 90vw; max-height: 90vh; border: 5px solid white; box-shadow: 0 10px 40px rgba(0,0,0,0.2); border-radius: 4px; transition: transform 0.3s ease;">`;
        document.body.appendChild(lightbox);
    }

    images.forEach(img => {
        img.parentElement.style.cursor = 'zoom-in';
        img.parentElement.addEventListener('click', (e) => {
            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.src = img.src;
            lightbox.style.display = 'flex';

            // Interaction: Subtle entrance scale
            lightboxImg.style.transform = 'scale(0.8)';
            setTimeout(() => {
                lightboxImg.style.transform = 'scale(1)';
            }, 10);
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });
}
