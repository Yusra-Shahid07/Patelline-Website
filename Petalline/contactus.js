// home.js
document.addEventListener('DOMContentLoaded', function () {
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// home.js
window.addEventListener('scroll', function () {
  const btn = document.getElementById('backToTop');
  if (window.scrollY > 300) {
    btn.style.display = 'block';
  } else {
    btn.style.display = 'none';
  }
});

document.querySelector('.subscribe button').addEventListener('click', function () {
  const email = document.querySelector('.subscribe input').value;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(email)) {
    alert('Please enter a valid email address.');
  } else {
    alert('Subscribed!');
  }
});


// MAIN













/**
 * Contact Form JavaScript - Bloom & Blossom Flower Shop
 * Professional form handling with validation, animations, and user experience enhancements
 */

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.clearBtn = document.querySelector('.prev-btn');
        this.submitBtn = document.querySelector('.next-btn');
        this.hiddenSubmitBtn = document.querySelector('.submit-btn');
        this.loader = document.querySelector('.btn-loader');
        
        this.validationRules = {
            name: /^[a-zA-Z\s]{2,50}$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[\+]?[1-9][\d]{0,15}$/
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupAccessibility();
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Clear form button
        this.clearBtn.addEventListener('click', (e) => this.clearForm(e));
        
        // Submit button (acts as form submit trigger)
        this.submitBtn.addEventListener('click', (e) => this.triggerSubmit(e));
        
        // Real-time validation
        this.setupRealTimeValidation();
        
        // Input focus animations
        this.setupInputAnimations();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
    }
    
    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            // Validate on blur (when user leaves the field)
            input.addEventListener('blur', () => this.validateField(input));
            
            // Clear errors on focus
            input.addEventListener('focus', () => this.clearFieldError(input));
            
            // Real-time validation for email and phone (with debounce)
            if (input.type === 'email' || input.type === 'tel') {
                input.addEventListener('input', this.debounce(() => {
                    if (input.value.length > 3) {
                        this.validateField(input);
                    }
                }, 500));
            }
        });
    }
    
    setupInputAnimations() {
        const inputs = this.form.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
                this.animateLabel(input, 'focus');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                    this.animateLabel(input, 'blur');
                }
            });
        });
    }
    
    setupKeyboardNavigation() {
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.type !== 'submit') {
                e.preventDefault();
                this.focusNextInput(e.target);
            }
        });
    }
    
    setupAccessibility() {
        // Add ARIA labels and descriptions
        const inputs = this.form.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            const label = input.parentElement.querySelector('.form-label');
            const feedback = input.parentElement.querySelector('.input-feedback');
            
            if (label) {
                input.setAttribute('aria-labelledby', `${input.id}-label`);
                label.id = `${input.id}-label`;
            }
            
            if (feedback) {
                input.setAttribute('aria-describedby', `${input.id}-feedback`);
                feedback.id = `${input.id}-feedback`;
            }
        });
    }
    
    validateField(input) {
        const value = input.value.trim();
        const validateType = input.dataset.validate;
        const isRequired = input.required;
        
        let isValid = true;
        let errorMessage = '';
        
        // Check if required field is empty
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Validate based on type
        else if (value && validateType) {
            switch (validateType) {
                case 'name':
                    if (!this.validationRules.name.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid name (2-50 characters, letters only)';
                    }
                    break;
                case 'email':
                    if (!this.validationRules.email.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'phone':
                    if (!this.validationRules.phone.test(value.replace(/[\s\-\(\)]/g, ''))) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number';
                    }
                    break;
            }
        }
        
        this.showFieldValidation(input, isValid, errorMessage);
        return isValid;
    }
    
    showFieldValidation(input, isValid, errorMessage) {
        const feedback = input.parentElement.querySelector('.input-feedback');
        
        // Remove existing classes
        input.classList.remove('valid', 'invalid');
        
        if (input.value.trim()) {
            if (isValid) {
                input.classList.add('valid');
                input.setAttribute('aria-invalid', 'false');
            } else {
                input.classList.add('invalid');
                input.setAttribute('aria-invalid', 'true');
            }
        }
        
        if (feedback) {
            feedback.textContent = errorMessage;
            feedback.classList.toggle('show', !isValid && errorMessage);
        }
    }
    
    clearFieldError(input) {
        const feedback = input.parentElement.querySelector('.input-feedback');
        
        if (feedback) {
            feedback.classList.remove('show');
            setTimeout(() => {
                feedback.textContent = '';
            }, 300);
        }
        
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('.form-input[required], .form-input[data-validate]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            const isFieldValid = this.validateField(input);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    clearForm(e) {
        e.preventDefault();
        
        // Show confirmation dialog
        if (this.hasFormData()) {
            const confirmed = confirm('Are you sure you want to clear all form data? This action cannot be undone.');
            if (!confirmed) return;
        }
        
        // Animate form clearing
        this.animateFormClear();
        
        // Reset form
        setTimeout(() => {
            this.form.reset();
            this.clearAllValidations();
            this.showSuccessMessage('Form cleared successfully', 'info');
        }, 300);
    }
    
    hasFormData() {
        const inputs = this.form.querySelectorAll('.form-input');
        return Array.from(inputs).some(input => input.value.trim() !== '');
    }
    
    clearAllValidations() {
        const inputs = this.form.querySelectorAll('.form-input');
        const feedbacks = this.form.querySelectorAll('.input-feedback');
        
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
            input.removeAttribute('aria-invalid');
        });
        
        feedbacks.forEach(feedback => {
            feedback.classList.remove('show');
            feedback.textContent = '';
        });
    }
    
    triggerSubmit(e) {
        e.preventDefault();
        
        // Validate form first
        if (this.validateForm()) {
            this.handleSubmit(e);
        } else {
            this.showValidationErrors();
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showValidationErrors();
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Simulate API call (replace with actual endpoint)
            await this.submitFormData(formData);
            
            // Show success message
            this.showSuccessMessage('Thank you! Your contact request has been submitted successfully. We\'ll get back to you within 2 hours.');
            
            // Reset form after successful submission
            setTimeout(() => {
                this.form.reset();
                this.clearAllValidations();
            }, 2000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Sorry, there was an error submitting your request. Please try again or contact us directly.');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        
        // Add timestamp and additional metadata
        data.timestamp = new Date().toISOString();
        data.userAgent = navigator.userAgent;
        data.referrer = document.referrer;
        
        return data;
    }
    
    async submitFormData(data) {
        // Simulate API call with promise
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    console.log('Form data submitted:', data);
                    resolve({ success: true, message: 'Form submitted successfully' });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }
    
    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.clearBtn.disabled = true;
            this.loader.style.display = 'block';
            this.submitBtn.querySelector('i').style.display = 'none';
            this.submitBtn.innerHTML = this.submitBtn.innerHTML.replace('Submit Contact Request', 'Submitting...');
        } else {
            this.submitBtn.disabled = false;
            this.clearBtn.disabled = false;
            this.loader.style.display = 'none';
            this.submitBtn.querySelector('i').style.display = 'inline';
            this.submitBtn.innerHTML = this.submitBtn.innerHTML.replace('Submitting...', 'Submit Contact Request');
        }
    }
    
    showValidationErrors() {
        const firstInvalidInput = this.form.querySelector('.form-input.invalid');
        if (firstInvalidInput) {
            firstInvalidInput.focus();
            this.scrollToElement(firstInvalidInput);
        }
        
        this.showErrorMessage('Please fix the errors above and try again.');
    }
    
    showSuccessMessage(message, type = 'success') {
        this.showNotification(message, type);
    }
    
    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.form-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            maxWidth: '400px',
            padding: '16px 20px',
            borderRadius: '12px',
            backgroundColor: type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1',
            color: type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460',
            border: `1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'}`,
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease-out',
            fontFamily: 'Poppins, sans-serif'
        });
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Handle close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));
        
        // Auto remove after 5 seconds
        setTimeout(() => this.removeNotification(notification), 5000);
    }
    
    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }
    
    animateLabel(input, action) {
        const label = input.parentElement.querySelector('.form-label');
        if (label) {
            if (action === 'focus') {
                label.style.transform = 'translateY(-2px)';
                label.style.color = '#ff8da1';
            } else {
                label.style.transform = 'translateY(0)';
                label.style.color = '#fb5581';
            }
        }
    }
    
    animateFormClear() {
        const inputs = this.form.querySelectorAll('.form-input');
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.style.transform = 'scale(0.95)';
                input.style.opacity = '0.5';
                setTimeout(() => {
                    input.style.transform = 'scale(1)';
                    input.style.opacity = '1';
                }, 150);
            }, index * 50);
        });
    }
    
    focusNextInput(currentInput) {
        const inputs = Array.from(this.form.querySelectorAll('.form-input'));
        const currentIndex = inputs.indexOf(currentInput);
        const nextInput = inputs[currentIndex + 1];
        
        if (nextInput) {
            nextInput.focus();
        } else {
            this.submitBtn.focus();
        }
    }
    
    scrollToElement(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    initializeAnimations() {
        // Add CSS for notifications if not present
        if (!document.querySelector('#notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                .form-notification .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .form-notification .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    margin-left: auto;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                
                .form-notification .notification-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Trigger entrance animations for info cards
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        });
        
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }
}

// Utility functions
const FormUtils = {
    formatPhoneNumber: (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
        }
        return value;
    },
    
    sanitizeInput: (value) => {
        return value.trim().replace(/[<>]/g, '');
    },
    
    validateEmailDomain: (email) => {
        const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        const domain = email.split('@')[1];
        return commonDomains.includes(domain) || domain.includes('.');
    }
};

// Initialize the contact form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
    
    // Add phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const formatted = FormUtils.formatPhoneNumber(e.target.value);
            if (formatted !== e.target.value) {
                e.target.value = formatted;
            }
        });
    }
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Contact form loaded in ${loadTime.toFixed(2)}ms`);
        });
    }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContactFormHandler, FormUtils };
}