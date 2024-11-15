// Navigation responsive
document.addEventListener('DOMContentLoaded', function() {
    // Menu hamburger
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Fermer le menu si on clique en dehors
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navLinks.classList.remove('active');
        }
    });

    // Animation scroll smooth pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                navLinks.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
});

// Gestion des formulaires
class FormHandler {
    constructor(formElement) {
        this.form = formElement;
        this.setupFormValidation();
    }

    setupFormValidation() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });

        // Validation en temps réel
        this.form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch(field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'Email invalide';
                break;
            case 'tel':
                const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
                isValid = phoneRegex.test(value);
                errorMessage = 'Numéro de téléphone invalide';
                break;
            default:
                isValid = value.length > 0;
                errorMessage = 'Ce champ est requis';
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    validateForm() {
        let isValid = true;
        this.form.querySelectorAll('input[required], textarea[required]').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        const parent = field.parentElement;
        let errorElement = parent.querySelector('.error-message');

        if (!isValid) {
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                parent.appendChild(errorElement);
            }
            errorElement.textContent = message;
            field.classList.add('invalid');
        } else {
            if (errorElement) {
                errorElement.remove();
            }
            field.classList.remove('invalid');
        }
    }

    async submitForm() {
        const submitButton = this.form.querySelector('[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Envoi en cours...';

        try {
            const formData = new FormData(this.form);
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showSuccess();
                this.form.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Envoyer';
        }
    }

    showSuccess() {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = 'Message envoyé avec succès !';
        this.form.insertAdjacentElement('beforebegin', alert);
        setTimeout(() => alert.remove(), 5000);
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.textContent = `Erreur : ${message}`;
        this.form.insertAdjacentElement('beforebegin', alert);
        setTimeout(() => alert.remove(), 5000);
    }
}