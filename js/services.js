document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du formulaire de réservation
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        new FormHandler(bookingForm);
    }

    // Gestion des cartes de services
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.matches('.book-service')) {
                const serviceId = this.dataset.serviceId;
                showServiceDetails(serviceId);
            }
        });

        const bookButton = card.querySelector('.book-service');
        if (bookButton) {
            bookButton.addEventListener('click', function(e) {
                e.stopPropagation();
                const serviceId = this.closest('.service-card').dataset.serviceId;
                scrollToBookingForm(serviceId);
            });
        }
    });

    // Slider des témoignages
    initTestimonialsSlider();
});

function showServiceDetails(serviceId) {
    // Création de la modal
    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="service-details">
                <h2>Détails du service</h2>
                <div class="loading">Chargement...</div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Gestion de la fermeture
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // Chargement des détails du service
    fetchServiceDetails(serviceId, modal);
}

async function fetchServiceDetails(serviceId, modal) {
    try {
        const response = await fetch(`/api/services/${serviceId}`);
        if (!response.ok) throw new Error('Service non trouvé');
        
        const data = await response.json();
        updateModalContent(modal, data);
    } catch (error) {
        showErrorInModal(modal, error.message);
    }
}

function updateModalContent(modal, data) {
    const content = modal.querySelector('.service-details');
    content.innerHTML = `
        <h2>${data.name}</h2>
        <div class="service-description">
            ${data.description}
        </div>
        <div class="service-pricing">
            <h3>Tarifs</h3>
            ${generatePricingHTML(data.pricing)}
        </div>
        <button class="btn btn-primary book-now">Réserver maintenant</button>
    `;

    const bookButton = content.querySelector('.book-now');
    bookButton.addEventListener('click', () => {
        modal.remove();
        scrollToBookingForm(data.id);
    });
}

function generatePricingHTML(pricing) {
    return pricing.map(price => `
        <div class="price-item">
            <span class="price-name">${price.name}</span>
            <span class="price-value">${price.value}€</span>
        </div>
    `).join('');
}

function scrollToBookingForm(serviceId) {
    const bookingForm = document.querySelector('.booking-form');
    const serviceSelect = bookingForm.querySelector('[name="service"]');
    
    if (serviceSelect) {
        serviceSelect.value = serviceId;
    }

    bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    let currentSlide = 0;
    const slides = slider.querySelectorAll('.testimonial');
    const totalSlides = slides.length;

    function updateSlider() {
        const offset = -currentSlide * 100;
        slider.style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // Navigation buttons
    const nav = document.createElement('div');
    nav.className = 'slider-nav';
    nav.innerHTML = `
        <button class="prev-slide">&lt;</button>
        <button class="next-slide">&gt;</button>
    `;

    slider.parentElement.appendChild(nav);

    nav.querySelector('.prev-slide').addEventListener('click', prevSlide);
    nav.querySelector('.next-slide').addEventListener('click', nextSlide);

    // Auto-play
    setInterval(nextSlide, 5000);
}