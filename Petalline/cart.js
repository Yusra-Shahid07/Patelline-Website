class CartManager {
    constructor() {
        // Constants aligned with product page
        this.MAX_QUANTITY_PER_ITEM = 99;
        this.MAX_ITEMS_TOTAL = 50;
        this.taxRate = 0.08;
        this.freeShippingThreshold = 100;
        this.shippingCost = 9.99;
        this.discountCodes = {
            'SAVE10': { discount: 0.10, minAmount: 50 },
            'WELCOME20': { discount: 0.20, minAmount: 75 },
            'FLOWERS15': { discount: 0.15, minAmount: 60 }
        };
        this.appliedDiscount = null;
        this.cartItems = [];
        this.initialized = false; // Add flag to prevent duplicate initialization

        this.init();
    }

    init() {
        // Prevent multiple initializations
        if (this.initialized) {
            console.warn('CartManager already initialized');
            return;
        }

        this.loadCartFromStorage();
        this.displayCartItems();
        this.updateCartSummary();
        this.setupEventListeners();
        this.setupStorageListener();
        this.checkEmptyCart();
        this.updateCartCount();
        this.initialized = true;
    }

    loadCartFromStorage() {
        try {
            const cartData = localStorage.getItem('petalline-cart');
            if (cartData) {
                const parsedData = JSON.parse(cartData);
                this.cartItems = parsedData.items || [];
            } else {
                this.cartItems = [];
            }
            console.log('Loaded cart items:', this.cartItems);
        } catch (error) {
            console.error('Error loading cart:', error);
            this.cartItems = [];
        }
    }

    saveCartToStorage() {
        try {
            const cartData = {
                items: this.cartItems,
                lastUpdated: Date.now()
            };
            localStorage.setItem('petalline-cart', JSON.stringify(cartData));
            
            // Dispatch custom event for other pages
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { cartItems: this.cartItems }
            }));
            
            console.log('Cart saved:', cartData);
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    setupStorageListener() {
        // Remove any existing listeners first
        window.removeEventListener('storage', this.handleStorageChange);
        window.removeEventListener('cartUpdated', this.handleCartUpdate);

        // Listen for storage changes from other tabs/pages
        this.handleStorageChange = (event) => {
            if (event.key === 'petalline-cart') {
                console.log('Storage change detected');
                this.loadCartFromStorage();
                this.displayCartItems();
                this.updateCartSummary();
                this.checkEmptyCart();
                this.updateCartCount();
            }
        };

        // Listen for custom cart update events
        this.handleCartUpdate = (event) => {
            console.log('Cart update event received');
            this.loadCartFromStorage();
            this.displayCartItems();
            this.updateCartSummary();
            this.checkEmptyCart();
            this.updateCartCount();
        };

        window.addEventListener('storage', this.handleStorageChange);
        window.addEventListener('cartUpdated', this.handleCartUpdate);
    }

    displayCartItems() {
        const cartItemsList = document.getElementById('cartItemsList');
        if (!cartItemsList) return;

        cartItemsList.innerHTML = '';

        if (this.cartItems.length === 0) {
            this.showEmptyCart();
            return;
        }

        this.cartItems.forEach((item, index) => {
            const cartItemElement = this.createCartItemElement(item, index);
            cartItemsList.appendChild(cartItemElement);
        });

        this.hideEmptyCart();
    }

    createCartItemElement(item, index) {
        const element = document.createElement('div');
        element.className = 'cart-item';
        element.dataset.itemId = item.id;
        element.dataset.index = index;
        
        const discountPercent = item.originalPrice ? 
            Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

        element.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.src='/Assets/placeholder.jpg'">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-description">${item.description || 'Beautiful floral arrangement'}</p>
                <div class="cart-item-rating">
                    ${this.generateStars(item.rating || 4.5)}
                    <span class="rating-text">(${item.rating || 4.5})</span>
                </div>
                ${item.category ? `<span class="cart-item-category">${item.category}</span>` : ''}
            </div>
            <div class="cart-item-controls">
                <div class="cart-quantity-controls">
                    <button class="cart-quantity-btn decrease-btn" data-action="decrease" data-item-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="cart-quantity-input" 
                           value="${item.quantity}" min="1" max="${this.MAX_QUANTITY_PER_ITEM}"
                           data-item-id="${item.id}">
                    <button class="cart-quantity-btn increase-btn" data-action="increase" data-item-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-price">
                    <div class="price-row">
                        <span class="unit-price">$${item.price.toFixed(2)} each</span>
                        <span class="cart-current-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    ${item.originalPrice ? `
                        <div class="price-row discount-row">
                            <span class="cart-original-price">Was: $${(item.originalPrice * item.quantity).toFixed(2)}</span>
                            <span class="cart-discount-badge">${discountPercent}% OFF</span>
                        </div>
                    ` : ''}
                </div>
                <button class="remove-item-btn" data-item-id="${item.id}">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        return element;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    updateQuantity(itemId, action, newQuantity = null) {
        console.log(`Updating quantity for item ${itemId}:`, action, newQuantity);
        
        const item = this.cartItems.find(i => i.id === itemId);
        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }

        const totalItems = this.cartItems.reduce((sum, i) => sum + i.quantity, 0);

        if (newQuantity !== null) {
            // Direct quantity update
            const quantity = Math.max(1, Math.min(newQuantity, this.MAX_QUANTITY_PER_ITEM));
            item.quantity = quantity;
        } else if (action === 'increase') {
            if (totalItems >= this.MAX_ITEMS_TOTAL) {
                this.showNotification(`Maximum ${this.MAX_ITEMS_TOTAL} items allowed`, 'warning');
                return;
            }
            if (item.quantity < this.MAX_QUANTITY_PER_ITEM) {
                item.quantity++;
            } else {
                this.showNotification(`Maximum ${this.MAX_QUANTITY_PER_ITEM} per item`, 'warning');
                return;
            }
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity--;
        }

        // Update the input field
        const quantityInput = document.querySelector(`input[data-item-id="${itemId}"]`);
        if (quantityInput) {
            quantityInput.value = item.quantity;
        }

        this.saveCartToStorage();
        this.updateCartSummary();
        this.updateCartCount();
        this.showNotification('Cart updated!', 'success');
    }

    removeItem(itemId) {
        console.log('Removing item:', itemId);
        
        const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const removedItem = this.cartItems.splice(itemIndex, 1)[0];
            this.saveCartToStorage();
            this.displayCartItems();
            this.updateCartSummary();
            this.updateCartCount();
            this.checkEmptyCart();
            this.showNotification(`${removedItem.name} removed from cart`, 'info');
        }
    }

    updateCartSummary() {
        try {
            const itemCount = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            
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

            // Apply promo code discount if available
            const promoDiscount = this.appliedDiscount ? 
                                 subtotal * this.appliedDiscount.discount : 
                                 0;
            const totalDiscountWithPromo = totalDiscount + promoDiscount;

            // Calculate shipping and tax
            const shipping = subtotal >= this.freeShippingThreshold ? 0 : this.shippingCost;
            const tax = (subtotal - totalDiscountWithPromo) * this.taxRate;
            const total = Math.max(0, subtotal - totalDiscountWithPromo + shipping + tax);

            // Update DOM elements safely
            this.updateElementText('.summary-line:nth-child(1) span:first-child', `Subtotal (${itemCount} items)`);
            this.updateElementText('.summary-line:nth-child(1) .summary-price', `$${subtotal.toFixed(2)}`);
            this.updateElementText('.discount-line .summary-price', `-$${totalDiscountWithPromo.toFixed(2)}`);
            this.updateElementText('.summary-line:nth-child(3) .summary-price', 
                                  shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`);
            this.updateElementText('.summary-line:nth-child(4) .summary-price', `$${tax.toFixed(2)}`);
            this.updateElementText('.total-price', `$${total.toFixed(2)}`);

            // Show/hide discount line
            const discountLine = document.querySelector('.discount-line');
            if (discountLine) {
                discountLine.style.display = totalDiscountWithPromo > 0 ? 'flex' : 'none';
            }

        } catch (error) {
            console.error('Error updating cart summary:', error);
        }
    }

    updateElementText(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }

    updateCartCount() {
        const itemCount = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update cart count in the cart page
        const cartCountElement = document.getElementById('cartItemCount');
        if (cartCountElement) {
            cartCountElement.textContent = `${itemCount} items`;
        }
    }

    applyPromoCode(code) {
        const promoCode = code.toUpperCase();
        const discount = this.discountCodes[promoCode];
        
        if (!discount) {
            this.showNotification('Invalid promo code', 'error');
            return;
        }

        const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (subtotal < discount.minAmount) {
            this.showNotification(`Minimum order of $${discount.minAmount} required for this code`, 'warning');
            return;
        }

        this.appliedDiscount = discount;
        this.updateCartSummary();
        this.showNotification(`Promo code applied! ${Math.round(discount.discount * 100)}% off`, 'success');
        
        // Update promo input
        const promoInput = document.querySelector('.promo-input');
        if (promoInput) {
            promoInput.value = code;
            promoInput.disabled = true;
        }
        
        // Update apply button
        const applyBtn = document.querySelector('.apply-promo-btn');
        if (applyBtn) {
            applyBtn.textContent = 'Applied';
            applyBtn.disabled = true;
        }
    }

    checkEmptyCart() {
        if (this.cartItems.length === 0) {
            this.showEmptyCart();
        } else {
            this.hideEmptyCart();
        }
    }

    showEmptyCart() {
        const emptyCartState = document.getElementById('emptyCartState');
        const cartContent = document.querySelector('.cart-content');
        
        if (emptyCartState) emptyCartState.style.display = 'flex';
        if (cartContent) cartContent.style.display = 'none';
    }

    hideEmptyCart() {
        const emptyCartState = document.getElementById('emptyCartState');
        const cartContent = document.querySelector('.cart-content');
        
        if (emptyCartState) emptyCartState.style.display = 'none';
        if (cartContent) cartContent.style.display = 'flex';
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('cartUpdateNotification');
        const notificationText = document.getElementById('notificationText');
        
        if (!notification || !notificationText) return;

        // Set message
        notificationText.textContent = message;
        
        // Set style based on type
        notification.className = 'cart-notification';
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ff9800';
                break;
            default:
                notification.style.backgroundColor = '#2196F3';
        }
        
        // Show notification
        notification.classList.add('show');
        
        // Hide after delay
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    setupEventListeners() {
        // Remove existing listeners to prevent duplicates
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('change', this.handleChange);

        // Create bound methods for proper removal later
        this.handleClick = (e) => {
            const target = e.target.closest('.cart-quantity-btn');
            if (target) {
                e.preventDefault();
                e.stopPropagation();
                const action = target.dataset.action;
                const itemId = parseInt(target.dataset.itemId);
                this.updateQuantity(itemId, action);
                return;
            }

            // Remove item
            const removeBtn = e.target.closest('.remove-item-btn');
            if (removeBtn) {
                e.preventDefault();
                e.stopPropagation();
                const itemId = parseInt(removeBtn.dataset.itemId);
                this.removeItem(itemId);
                return;
            }
        };

        this.handleChange = (e) => {
            if (e.target.classList.contains('cart-quantity-input')) {
                const itemId = parseInt(e.target.dataset.itemId);
                const newQuantity = parseInt(e.target.value) || 1;
                this.updateQuantity(itemId, null, newQuantity);
            }
        };

        // Add event listeners
        document.addEventListener('click', this.handleClick);
        document.addEventListener('change', this.handleChange);

        // Promo code application
        const applyPromoBtn = document.querySelector('.apply-promo-btn');
        const promoInput = document.querySelector('.promo-input');
        
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => {
                if (promoInput && promoInput.value.trim()) {
                    this.applyPromoCode(promoInput.value.trim());
                }
            });
        }

        if (promoInput) {
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && promoInput.value.trim()) {
                    this.applyPromoCode(promoInput.value.trim());
                }
            });
        }

        // Back to top
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }
}

// Prevent multiple instances
if (window.cartManager) {
    console.log('CartManager instance already exists');
} else {
    // Initialize when DOM loads or immediately if already loaded
    function initializeCartManager() {
        if (!window.cartManager) {
            console.log('Initializing CartManager...');
            window.cartManager = new CartManager();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCartManager);
    } else {
        initializeCartManager();
    }
}