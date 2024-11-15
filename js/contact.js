document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        new FormHandler(contactForm);
    }

    // Initialisation de la carte
    initMap();

    // Gestion des FAQ
    initFAQ();

    // Gestion du téléchargement de fichiers
    initFileUpload();
});

function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Exemple avec Leaflet (alternative gratuite à Google Maps)
    const map = L.map('map').setView([48.8566, 2.3522], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Ajout du marqueur
    const marker = L.marker([48.8566, 2.3522]).addTo(map);
    marker.bindPopup("<b>Notre emplacement</b><br>Adresse complète ici.").openPopup();
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            // Ferme toutes les autres réponses
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').classList.remove('active');
                    otherItem.querySelector('.faq-question').classList.remove('active');
                }
            });

            // Toggle la réponse actuelle
            answer.classList.toggle('active');
            question.classList.toggle('active');
        });
    });
}

function initFileUpload() {
    const fileInput = document.querySelector('.files-upload input[type="file"]');
    if (!fileInput) return;

    const fileList = document.createElement('div');
    fileList.className = 'file-list';
    fileInput.parentElement.appendChild(fileList);

    fileInput.addEventListener('change', function(e) {
        fileList.innerHTML = '';
        const files = Array.from(this.files);
        
        files.forEach(file => {
            const fileItem = createFileItem(file);
            fileList.appendChild(fileItem);
        });
    });
}

function createFileItem(file) {
    const item = document.createElement('div');
    item.className = 'file-item';
    
    const fileName = document.createElement('span');
    fileName.textContent = file.name;

    const fileSize = document.createElement('span');
    fileSize.textContent = formatFileSize(file.size);

    const removeButton = document.createElement('button');
    removeButton.textContent = '×';
    removeButton.addEventListener('click', () => {
        item.remove();
        // Mise à jour de l'input file
        // C'est un peu complique car les input file sont en lecture seule
        // mais une ne solution complète nécessiterait de gérer un FileList personnalisé
    });

    item.appendChild(fileName);
    item.appendChild(fileSize);
    item.appendChild(removeButton);

    return item;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Validation des coordonnées
function validateCoordinates(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

    let isValid = true;

    if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Email invalide');
        isValid = false;
    }

    if (!phoneRegex.test(phoneInput.value)) {
        showError(phoneInput, 'Numéro de téléphone invalide');
        isValid = false;
    }

    return isValid;
}

function showError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const parent = input.parentElement;
    const existing = parent.querySelector('.error-message');
    if (existing) {
        existing.remove();
    }

    parent.appendChild(errorDiv);
    input.classList.add('invalid');
}