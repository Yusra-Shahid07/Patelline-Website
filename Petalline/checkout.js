class CheckoutManager {
    constructor() {
        // Constants
        this.taxRate = 0.08;
        this.freeShippingThreshold = 100;
        this.shippingCost = 9.99;
        
        // Initialize
        this.init();
    }

    init() {
        this.loadCartItems();
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupDeliveryOptions();
        this.setupGiftOptions();
        this.setupPaymentOptions();
        this.generateOrderNumber();
    }

    loadCartItems() {
        try {
            const cartData = localStorage.getItem('petalline-cart');
            if (cartData) {
                const parsedData = JSON.parse(cartData);
                this.cartItems = parsedData.items || [];
                
                // If cart is empty, redirect to cart page
                if (this.cartItems.length === 0) {
                    window.location.href = '/cart.html';
                    return;
                }
                
                this.displayOrderItems();
                this.updateOrderSummary();
            } else {
                this.cartItems = [];
                // Redirect to cart if empty
                window.location.href = '/cart.html';
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.cartItems = [];
            // Create sample items if cart loading fails (for demo purposes)
            this.createSampleCart();
        }
    }

    createSampleCart() {
        // Sample cart items for demo if cart is empty or fails to load
        this.cartItems = [
            {
                id: 1,
                name: "Dreamy Blue & White Bouquet",
                price: 89.99,
                originalPrice: 99.99,
                quantity: 2,
                image: "./Assests/products/1.jpg"
            },
            {
                id: 2,
                name: "Rainbow Rose Celebration",
                price: 129.99,
                quantity: 1,
                image: "./Assests/products/13.jpg"
            },
            {
                id: 3,
                name: "Pure White Rose Bouquet",
                price: 114.99,
                quantity: 1,
                image: "./Assests/products/29.jpg"
            }
        ];
        this.displayOrderItems();
        this.updateOrderSummary();
    }

    displayOrderItems() {
        const orderItemsContainer = document.querySelector('.order-items');
        if (!orderItemsContainer || this.cartItems.length === 0) return;

        orderItemsContainer.innerHTML = '';

        this.cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            
            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='./Assests/placeholder.jpg'">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-quantity">Qty: ${item.quantity}</div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
            
            orderItemsContainer.appendChild(itemElement);
        });
    }

    updateOrderSummary() {
        if (this.cartItems.length === 0) return;

        // Calculate subtotal
        const subtotal = this.cartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Calculate item-level discounts
        const totalDiscount = this.cartItems.reduce((sum, item) => {
            return item.originalPrice ? 
                   sum + ((item.originalPrice - item.price) * item.quantity) : 
                   sum;
        }, 0);

        // Calculate shipping
        const shipping = subtotal >= this.freeShippingThreshold ? 0 : this.shippingCost;
        
        // Calculate tax
        const tax = (subtotal - totalDiscount) * this.taxRate;
        
        // Calculate total
        const total = Math.max(0, subtotal - totalDiscount + shipping + tax);

        // Calculate item count
        const itemCount = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update DOM elements
        this.updateElementText('.summary-line:nth-child(1) span:first-child', `Subtotal (${itemCount} items)`);
        this.updateElementText('.summary-line:nth-child(1) .summary-price', `$${subtotal.toFixed(2)}`);
        this.updateElementText('.discount-line .summary-price', `-$${totalDiscount.toFixed(2)}`);
        this.updateElementText('#deliveryPrice', shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`);
        this.updateElementText('.summary-line:nth-child(4) .summary-price', `$${tax.toFixed(2)}`);
        this.updateElementText('.total-price', `$${total.toFixed(2)}`);

        // Show/hide discount line
        const discountLine = document.querySelector('.discount-line');
        if (discountLine) {
            discountLine.style.display = totalDiscount > 0 ? 'flex' : 'none';
        }
    }

    updateElementText(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }

    setupEventListeners() {
        // Form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Place order button
        const placeOrderBtn = document.querySelector('.place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Back to top functionality
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('order-modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    setupFormValidation() {
        const form = document.getElementById('checkoutForm');
        if (!form) return;

        // Real-time validation for required fields
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });

        // Email validation
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', () => {
                this.validateEmail(emailField);
            });
        }

        // Phone validation
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.addEventListener('blur', () => {
                this.validatePhone(phoneField);
            });
        }
    }

    validateField(field) {
        const isValid = field.checkValidity();
        if (isValid) {
            field.style.borderColor = '#4CAF50';
        } else {
            field.style.borderColor = '#f44336';
        }
        return isValid;
    }

    validateEmail(emailField) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(emailField.value);
        
        if (isValid) {
            emailField.style.borderColor = '#4CAF50';
        } else {
            emailField.style.borderColor = '#f44336';
        }
        return isValid;
    }

    validatePhone(phoneField) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phoneField.value.replace(/[\s\-\(\)]/g, '');
        const isValid = phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
        
        if (isValid) {
            phoneField.style.borderColor = '#4CAF50';
        } else {
            phoneField.style.borderColor = '#f44336';
        }
        return isValid;
    }

    setupDeliveryOptions() {
        const deliveryOptions = document.querySelectorAll('input[name="deliveryType"]');
        const deliveryAddressSection = document.getElementById('deliveryAddressSection');
        
        deliveryOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                if (e.target.value === 'home') {
                    deliveryAddressSection.style.display = 'block';
                    // Make address fields required
                    const addressFields = deliveryAddressSection.querySelectorAll('input[name="address"], input[name="city"], select[name="state"], input[name="zipCode"]');
                    addressFields.forEach(field => {
                        field.required = true;
                    });
                } else {
                    deliveryAddressSection.style.display = 'none';
                    // Make address fields optional
                    const addressFields = deliveryAddressSection.querySelectorAll('input, select');
                    addressFields.forEach(field => {
                        field.required = false;
                    });
                }
            });
        });

        // Set minimum date for delivery
        const deliveryDateInput = document.getElementById('deliveryDate');
        if (deliveryDateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            deliveryDateInput.min = tomorrow.toISOString().split('T')[0];
        }
    }

    setupGiftOptions() {
        const isGiftCheckbox = document.getElementById('isGift');
        const giftMessageSection = document.getElementById('giftMessageSection');
        const giftMessageTextarea = document.getElementById('giftMessage');
        const giftMessageCount = document.getElementById('giftMessageCount');

        if (isGiftCheckbox && giftMessageSection) {
            isGiftCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    giftMessageSection.style.display = 'block';
                } else {
                    giftMessageSection.style.display = 'none';
                    giftMessageTextarea.value = '';
                    giftMessageCount.textContent = '0';
                }
            });
        }

        if (giftMessageTextarea && giftMessageCount) {
            giftMessageTextarea.addEventListener('input', (e) => {
                const length = e.target.value.length;
                giftMessageCount.textContent = length;
            });
        }
    }

    setupPaymentOptions() {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        const cardDetailsSection = document.getElementById('cardDetailsSection');
        const sameAsDeliveryCheckbox = document.getElementById('sameAsDelivery');
        const billingAddressForm = document.getElementById('billingAddressForm');

        // Add Cash on Delivery option if not exists
        const paymentMethodsSection = document.querySelector('.payment-methods-section');
        if (paymentMethodsSection && !document.getElementById('cashOnDelivery')) {
            const codOption = document.createElement('div');
            codOption.className = 'payment-method';
            codOption.innerHTML = `
                <input type="radio" id="cashOnDelivery" name="paymentMethod" value="cod">
                <label for="cashOnDelivery" class="payment-label">
                    <div class="payment-info">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>Cash on Delivery</span>
                    </div>
                </label>
            `;
            paymentMethodsSection.appendChild(codOption);
        }

        // Update payment methods list to include new option
        const updatedPaymentMethods = document.querySelectorAll('input[name="paymentMethod"]');

        // Toggle card details based on payment method
        updatedPaymentMethods.forEach(method => {
            method.addEventListener('change', (e) => {
                if (e.target.value === 'card') {
                    cardDetailsSection.style.display = 'block';
                    // Make card fields required
                    const cardFields = cardDetailsSection.querySelectorAll('input[required]');
                    cardFields.forEach(field => field.required = true);
                } else {
                    cardDetailsSection.style.display = 'none';
                    // Make card fields optional
                    const cardFields = cardDetailsSection.querySelectorAll('input');
                    cardFields.forEach(field => field.required = false);
                }
            });
        });

        // Toggle billing address form
        if (sameAsDeliveryCheckbox && billingAddressForm) {
            sameAsDeliveryCheckbox.addEventListener('change', (e) => {
                billingAddressForm.style.display = e.target.checked ? 'none' : 'block';
            });
        }

        // Format card number input
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/\D/g, '');
                if (value.length > 16) value = value.substring(0, 16);
                if (value.length > 0) {
                    value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
                }
                e.target.value = value;
                
                // Detect card type
                this.detectCardType(value);
            });
        }

        // Format expiry date input
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.substring(0, 4);
                if (value.length > 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        // Format CVV input
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.substring(0, 4);
                e.target.value = value;
            });
        }
    }

    detectCardType(cardNumber) {
        const cardTypeIcon = document.getElementById('cardTypeIcon');
        if (!cardTypeIcon) return;

        const number = cardNumber.replace(/\s/g, '');
        let cardType = '';

        if (number.match(/^4/)) {
            cardType = 'fab fa-cc-visa';
        } else if (number.match(/^5[1-5]/)) {
            cardType = 'fab fa-cc-mastercard';
        } else if (number.match(/^3[47]/)) {
            cardType = 'fab fa-cc-amex';
        }

        cardTypeIcon.className = cardType;
    }

    generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const orderNumber = `FL-${new Date().getFullYear()}-${timestamp.toString().slice(-6)}${random}`;
        
        const orderNumberElement = document.getElementById('orderNumber');
        if (orderNumberElement) {
            orderNumberElement.textContent = orderNumber;
        }
        
        this.currentOrderNumber = orderNumber;
    }

    handleFormSubmission() {
        const form = document.getElementById('checkoutForm');
        if (!form) return;

        // Validate form
        if (!this.validateForm()) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        // Process the order
        this.processOrder();
    }

    validateForm() {
        const form = document.getElementById('checkoutForm');
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.validateField(field);
                isValid = false;
            }
        });

        // Validate email format
        const email = document.getElementById('email');
        if (email && !this.validateEmail(email)) {
            isValid = false;
        }

        // Validate phone format
        const phone = document.getElementById('phone');
        if (phone && !this.validatePhone(phone)) {
            isValid = false;
        }

        // Validate terms acceptance
        const termsAccepted = document.getElementById('termsAccepted');
        if (termsAccepted && !termsAccepted.checked) {
            alert('Please accept the Terms and Conditions to proceed.');
            isValid = false;
        }

        // Validate payment method specific fields
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (paymentMethod && paymentMethod.value === 'card') {
            const cardNumber = document.getElementById('cardNumber');
            const expiryDate = document.getElementById('expiryDate');
            const cvv = document.getElementById('cvv');

            if (!cardNumber.value || cardNumber.value.replace(/\s/g, '').length < 13) {
                cardNumber.style.borderColor = '#f44336';
                isValid = false;
            }

            if (!expiryDate.value || expiryDate.value.length < 5) {
                expiryDate.style.borderColor = '#f44336';
                isValid = false;
            }

            if (!cvv.value || cvv.value.length < 3) {
                cvv.style.borderColor = '#f44336';
                isValid = false;
            }
        }

        return isValid;
    }

    async processOrder() {
        // Show processing modal
        const processingModal = document.getElementById('orderProcessingModal');
        if (processingModal) {
            processingModal.style.display = 'flex';
        }
        
        try {
            // Collect all order data
            const orderData = this.collectOrderData();
            
            // Simulate order processing
            const orderSuccess = await this.submitOrderToBackend(orderData);
            
            if (orderSuccess) {
                // Hide processing modal
                if (processingModal) {
                    processingModal.style.display = 'none';
                }
                
                // Show detailed confirmation popup
                this.showOrderConfirmationPopup(orderData);
                
            } else {
                throw new Error('Order submission failed');
            }
        } catch (error) {
            console.error('Order processing error:', error);
            this.showOrderError();
        }
    }

    collectOrderData() {
        const form = document.getElementById('checkoutForm');
        const formData = new FormData(form);
        
        return {
            orderNumber: this.currentOrderNumber,
            customer: {
                email: formData.get('email'),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                phone: formData.get('phone')
            },
            delivery: {
                type: formData.get('deliveryType'),
                address: formData.get('deliveryType') === 'home' ? {
                    street: formData.get('address'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    zipCode: formData.get('zipCode'),
                    instructions: formData.get('deliveryInstructions')
                } : null,
                date: formData.get('deliveryDate'),
                time: formData.get('deliveryTime')
            },
            payment: {
                method: formData.get('paymentMethod'),
                details: formData.get('paymentMethod') === 'card' ? {
                    cardNumber: formData.get('cardNumber'),
                    expiryDate: formData.get('expiryDate'),
                    cvv: formData.get('cvv'),
                    cardName: formData.get('cardName'),
                    billingAddress: formData.get('sameAsDelivery') ? null : {
                        street: formData.get('billingAddress'),
                        city: formData.get('billingCity'),
                        state: formData.get('billingState'),
                        zipCode: formData.get('billingZip')
                    }
                } : null
            },
            gift: formData.get('isGift') ? {
                message: formData.get('giftMessage'),
                from: formData.get('giftFrom'),
                to: formData.get('giftTo')
            } : null,
            items: this.cartItems,
            subtotal: this.calculateSubtotal(),
            discount: this.calculateDiscount(),
            shipping: this.calculateShipping(),
            tax: this.calculateTax(),
            total: this.calculateTotal(),
            timestamp: new Date().toISOString()
        };
    }

    calculateSubtotal() {
        return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    calculateDiscount() {
        return this.cartItems.reduce((sum, item) => {
            return item.originalPrice ? 
                   sum + ((item.originalPrice - item.price) * item.quantity) : 
                   sum;
        }, 0);
    }

    calculateShipping() {
        const subtotal = this.calculateSubtotal();
        return subtotal >= this.freeShippingThreshold ? 0 : this.shippingCost;
    }

    calculateTax() {
        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount();
        return (subtotal - discount) * this.taxRate;
    }

    calculateTotal() {
        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount();
        const shipping = this.calculateShipping();
        const tax = this.calculateTax();
        return Math.max(0, subtotal - discount + shipping + tax);
    }

    async submitOrderToBackend(orderData) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real application, you would send the orderData to your backend API
        // For demo purposes, we'll always return success
        console.log('Order data:', orderData);
        return true;
    }

    showOrderError() {
        // Hide processing modal
        const processingModal = document.getElementById('orderProcessingModal');
        if (processingModal) {
            processingModal.style.display = 'none';
        }
        
        // Show error message
        alert('There was an error processing your order. Please try again or contact support.');
    }

    showOrderConfirmationPopup(orderData) {
        // Create popup container
        const popup = document.createElement('div');
        popup.className = 'order-confirmation-popup';
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
            z-index: 3000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        // Create popup content
        const popupContent = document.createElement('div');
        popupContent.className = 'popup-content';
        popupContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        // Format order details
        const formattedDate = new Date(orderData.timestamp).toLocaleString();
        const paymentMethod = this.getPaymentMethodDisplayName(orderData.payment.method);
        
        // Build popup HTML
        popupContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: #4CAF50; margin-bottom: 1rem;"></i>
                <h2 style="color: #ff5581; margin: 1rem 0;">Order Confirmed!</h2>
                <p style="color: #666;">Thank you for your order. Here are your order details:</p>
                <div style="background: #ffe8ed; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <strong>Order #: ${orderData.orderNumber}</strong><br>
                    <strong>Date: ${formattedDate}</strong>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <h3 style="color: #ff5581; border-bottom: 2px solid #ffe8ed; padding-bottom: 0.5rem; margin-bottom: 1rem;">
                        <i class="fas fa-user"></i> Customer Details
                    </h3>
                    <p><strong>Name:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                    <p><strong>Email:</strong> ${orderData.customer.email}</p>
                    <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
                </div>
                
                <div>
                    <h3 style="color: #ff5581; border-bottom: 2px solid #ffe8ed; padding-bottom: 0.5rem; margin-bottom: 1rem;">
                        <i class="fas fa-truck"></i> Delivery Details
                    </h3>
                    <p><strong>Method:</strong> ${orderData.delivery.type === 'home' ? 'Home Delivery' : 'Store Pickup'}</p>
                    ${orderData.delivery.type === 'home' && orderData.delivery.address ? `
                        <p><strong>Address:</strong> ${orderData.delivery.address.street}, ${orderData.delivery.address.city}, 
                        ${orderData.delivery.address.state} ${orderData.delivery.address.zipCode}</p>
                        ${orderData.delivery.address.instructions ? `
                            <p><strong>Instructions:</strong> ${orderData.delivery.address.instructions}</p>
                        ` : ''}
                    ` : ''}
                    <p><strong>Delivery Date:</strong> ${orderData.delivery.date}</p>
                    <p><strong>Time Slot:</strong> ${this.formatTimeSlot(orderData.delivery.time)}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #ff5581; border-bottom: 2px solid #ffe8ed; padding-bottom: 0.5rem; margin-bottom: 1rem;">
                    <i class="fas fa-credit-card"></i> Payment Information
                </h3>
                <p><strong>Method:</strong> ${paymentMethod}</p>
                ${orderData.payment.method === 'card' && orderData.payment.details ? `
                    <p><strong>Card:</strong> **** **** **** ${orderData.payment.details.cardNumber.replace(/\s/g, '').slice(-4)}</p>
                    <p><strong>Expires:</strong> ${orderData.payment.details.expiryDate}</p>
                ` : ''}
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #ff5581; border-bottom: 2px solid #ffe8ed; padding-bottom: 0.5rem; margin-bottom: 1rem;">
                    <i class="fas fa-shopping-bag"></i> Order Items
                </h3>
                <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ffe8ed; border-radius: 8px; padding: 1rem;">
                    ${orderData.items.map(item => `
                        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #ffe8ed; align-items: center;">
                            <img src="${item.image}" alt="${item.name}" 
                                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                            <div style="flex: 1;">
                                <p style="font-weight: 500; margin-bottom: 0.5rem;">${item.name}</p>
                                <p style="color: #666; margin-bottom: 0.5rem;">Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
                                <p style="color: #ff5581; font-weight: 500;">$${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h3 style="color: #ff5581; border-bottom: 2px solid #ffe8ed; padding-bottom: 0.5rem; margin-bottom: 1rem;">
                    <i class="fas fa-receipt"></i> Order Summary
                </h3>
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 0.5rem; align-items: center;">
                    <span>Subtotal (${orderData.items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                    <span style="text-align: right; font-weight: 500;">$${orderData.subtotal.toFixed(2)}</span>
                    ${orderData.discount > 0 ? `
                        <span>Discount:</span>
                        <span style="text-align: right; color: #ff5581; font-weight: 500;">-$${orderData.discount.toFixed(2)}</span>
                    ` : ''}
                    <span>Delivery:</span>
                    <span style="text-align: right; font-weight: 500;">${orderData.shipping === 0 ? 'Free' : `$${orderData.shipping.toFixed(2)}`}</span>
                    <span>Tax:</span>
                    <span style="text-align: right; font-weight: 500;">$${orderData.tax.toFixed(2)}</span>
                    <hr style="grid-column: 1 / -1; border: none; height: 1px; background: #ffe8ed; margin: 1rem 0;">
                    <span style="font-weight: 600; font-size: 1.1rem;">Total:</span>
                    <span style="text-align: right; color: #ff5581; font-weight: 600; font-size: 1.2rem;">$${orderData.total.toFixed(2)}</span>
                </div>
            </div>
            
            ${orderData.gift ? `
                <div style="background: #fff8e1; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3 style="color: #ff5581; border-bottom: 2px solid #ffe8ed; padding-bottom: 0.5rem; margin-bottom: 1rem;">
                        <i class="fas fa-gift"></i> Gift Message
                    </h3>
                    <p><strong>To:</strong> ${orderData.gift.to}</p>
                    <p><strong>From:</strong> ${orderData.gift.from}</p>
                    <p><strong>Message:</strong> ${orderData.gift.message}</p>
                </div>
            ` : ''}
            
            <div style="text-align: center;">
                <button id="closePopupBtn" style="
                    background: linear-gradient(135deg, #ff5581 0%, #ff8da1 100%);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(255, 85, 129, 0.3)';"
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <i class="fas fa-check"></i> Close & Continue Shopping
                </button>
            </div>
        `;
        
        // Add to DOM
        popup.appendChild(popupContent);
        document.body.appendChild(popup);
        
        // Add close button event and outside click event
        const closeBtn = document.getElementById('closePopupBtn');
        closeBtn.addEventListener('click', () => {
            this.closeConfirmationAndCleanup(popup);
        });

        // Close when clicking outside the popup
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.closeConfirmationAndCleanup(popup);
            }
        });
    }

    closeConfirmationAndCleanup(popup) {
        // Clear form and cart
        this.clearForm();
        this.clearCart();
        
        // Remove popup
        document.body.removeChild(popup);
        
        // Show success modal (optional)
        const successModal = document.getElementById('orderSuccessModal');
        if (successModal) {
            successModal.style.display = 'flex';
        }
        
        // Generate new order number for next order
        this.generateOrderNumber();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getPaymentMethodDisplayName(method) {
        switch(method) {
            case 'card': return 'Credit/Debit Card';
            case 'paypal': return 'PayPal';
            case 'apple': return 'Apple Pay';
            case 'cod': return 'Cash on Delivery';
            default: return method;
        }
    }

    formatTimeSlot(time) {
        if (!time) return '';
        const times = {
            '9-12': '9:00 AM - 12:00 PM',
            '12-15': '12:00 PM - 3:00 PM',
            '15-18': '3:00 PM - 6:00 PM',
            '18-21': '6:00 PM - 9:00 PM'
        };
        return times[time] || time;
    }

    clearForm() {
        const form = document.getElementById('checkoutForm');
        if (form) {
            // Reset all form elements
            form.reset();
            
            // Clear any custom formatting and reset field styles
            const allInputs = form.querySelectorAll('input, select, textarea');
            allInputs.forEach(input => {
                input.style.borderColor = '';
                input.value = '';
            });
            
            // Reset specific fields
            const cardNumber = document.getElementById('cardNumber');
            if (cardNumber) cardNumber.value = '';
            
            const expiryDate = document.getElementById('expiryDate');
            if (expiryDate) expiryDate.value = '';
            
            const cvv = document.getElementById('cvv');
            if (cvv) cvv.value = '';
            
            // Reset delivery address visibility
            const deliveryAddressSection = document.getElementById('deliveryAddressSection');
            if (deliveryAddressSection) {
                deliveryAddressSection.style.display = 'block';
            }
            
            // Reset gift message section
            const isGiftCheckbox = document.getElementById('isGift');
            const giftMessageSection = document.getElementById('giftMessageSection');
            const giftMessage = document.getElementById('giftMessage');
            const giftMessageCount = document.getElementById('giftMessageCount');
            
            if (isGiftCheckbox) isGiftCheckbox.checked = false;
            if (giftMessageSection) giftMessageSection.style.display = 'none';
            if (giftMessage) giftMessage.value = '';
            if (giftMessageCount) giftMessageCount.textContent = '0';
            
            // Reset payment method to default
            const creditCardRadio = document.getElementById('creditCard');
            const cardDetailsSection = document.getElementById('cardDetailsSection');
            if (creditCardRadio) creditCardRadio.checked = true;
            if (cardDetailsSection) cardDetailsSection.style.display = 'block';
            
            // Reset billing address
            const sameAsDelivery = document.getElementById('sameAsDelivery');
            const billingAddressForm = document.getElementById('billingAddressForm');
            if (sameAsDelivery) sameAsDelivery.checked = true;
            if (billingAddressForm) billingAddressForm.style.display = 'none';
            
            // Reset delivery date to minimum
            const deliveryDateInput = document.getElementById('deliveryDate');
            if (deliveryDateInput) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                deliveryDateInput.min = tomorrow.toISOString().split('T')[0];
                deliveryDateInput.value = '';
            }
        }
    }

    clearCart() {
        // In a real application, this would clear localStorage
        // localStorage.removeItem('petalline-cart');
        
        // For demo purposes, we'll reset to empty and show empty state
        this.cartItems = [];
        
        // Clear order items display
        const orderItemsContainer = document.querySelector('.order-items');
        if (orderItemsContainer) {
            orderItemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is now empty</p>';
        }
        
        // Reset order summary
        this.updateElementText('.summary-line:nth-child(1) span:first-child', 'Subtotal (0 items)');
        this.updateElementText('.summary-line:nth-child(1) .summary-price', '$0.00');
        this.updateElementText('.discount-line .summary-price', '-$0.00');
        this.updateElementText('#deliveryPrice', '$9.99');
        this.updateElementText('.summary-line:nth-child(4) .summary-price', '$0.00');
        this.updateElementText('.total-price', '$9.99');
        
        // Hide discount line
        const discountLine = document.querySelector('.discount-line');
        if (discountLine) {
            discountLine.style.display = 'none';
        }
        
        console.log('Cart cleared successfully');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize checkout manager
    window.checkoutManager = new CheckoutManager();
});