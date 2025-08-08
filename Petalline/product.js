// ProductManager Class with enhanced features
class ProductManager {
  constructor() {
    // Constants
    this.MAX_QUANTITY = 99;
    this.MIN_QUANTITY = 1;
    this.PRODUCTS_PER_PAGE = 12;
    this.NOTIFICATION_DURATION = 3000;
    this.ERROR_NOTIFICATION_DURATION = 4000;

    // State
    this.products = [];
    this.currentPage = 1;
    this.totalPages = 0;
    this.quantities = {};

    // Initialize
    this.init();
  }

  async init() {
    try {
      this.products = await this.loadProducts();
      this.totalPages = Math.ceil(this.products.length / this.PRODUCTS_PER_PAGE);
      this.initializeQuantities();
      this.displayProducts();
      this.setupPagination();
      this.setupEventListeners();
      this.setupModalListeners();
    } catch (error) {
      console.error('Initialization failed:', error);
      this.showErrorNotification('Failed to load products');
    }
  }

  async loadProducts() {
    try {
      // In a real app, this would be an API call
      return this.generateProducts();
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }

  initializeQuantities() {
    this.products.forEach(product => {
      this.quantities[product.id] = this.MIN_QUANTITY;
    });
  }

  displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const startIndex = (this.currentPage - 1) * this.PRODUCTS_PER_PAGE;
    const endIndex = startIndex + this.PRODUCTS_PER_PAGE;
    const productsToShow = this.products.slice(startIndex, endIndex);

    productsGrid.innerHTML = '';

    productsToShow.forEach((product, index) => {
      const productCard = this.createProductCard(product);
      // Stagger animations
      productCard.style.animationDelay = `${index * 0.05}s`;
      productsGrid.appendChild(productCard);
    });

    this.updatePageInfo();
  }

  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    card.innerHTML = `
      ${product.onSale ? `<div class="sale-badge" aria-label="On sale: ${discountPercent}% off">SALE ${discountPercent}% OFF</div>` : ''}
      <div class="product-image" style="background-image: url('${product.image}')" 
           role="button" aria-label="View details of ${product.name}" tabindex="0"></div>
      <h3 class="product-name" tabindex="0" aria-label="${product.name}">${product.name}</h3>
      <div class="product-rating" aria-label="Rating: ${product.rating} out of 5">
        ${this.generateStars(product.rating)}
        <span class="sr-only">${product.rating} out of 5 stars</span>
      </div>
      <div class="product-price" aria-label="Price: $${product.price.toFixed(2)}${product.originalPrice ? `, originally $${product.originalPrice.toFixed(2)}` : ''}">
        <span class="current-price">$${product.price.toFixed(2)}</span>
        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
        ${product.discount ? `<span class="discount-percent">${product.discount}% OFF</span>` : ''}
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" aria-label="Decrease quantity" data-action="decrease">
          <i class="fas fa-minus" aria-hidden="true"></i>
        </button>
        <input type="number" class="quantity-input" 
               value="${this.quantities[product.id] || this.MIN_QUANTITY}" 
               min="${this.MIN_QUANTITY}" max="${this.MAX_QUANTITY}" 
               aria-label="Quantity" data-product-id="${product.id}">
        <button class="quantity-btn" aria-label="Increase quantity" data-action="increase">
          <i class="fas fa-plus" aria-hidden="true"></i>
        </button>
      </div>
      <button class="add-to-cart" aria-label="Add ${product.name} to cart">
        <i class="fas fa-shopping-cart" aria-hidden="true"></i>
        Add to Cart
      </button>
      <button class="view-details-btn" aria-label="View details for ${product.name}">
        View Details
      </button>
    `;
    
    return card;
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fas fa-star" aria-hidden="true"></i>';
    }
    
    if (hasHalfStar) {
      starsHTML += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="far fa-star" aria-hidden="true"></i>';
    }
    
    return starsHTML;
  }

  setupPagination() {
    const pageNumbers = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!pageNumbers || !prevBtn || !nextBtn) return;

    pageNumbers.innerHTML = '';

    for (let i = 1; i <= this.totalPages; i++) {
      const pageNumber = document.createElement('div');
      pageNumber.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
      pageNumber.textContent = i;
      pageNumber.setAttribute('aria-label', `Page ${i}`);
      pageNumber.setAttribute('aria-current', i === this.currentPage ? 'page' : 'false');
      pageNumber.tabIndex = 0;
      pageNumber.addEventListener('click', () => this.goToPage(i));
      pageNumber.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.goToPage(i);
        }
      });
      pageNumbers.appendChild(pageNumber);
    }

    prevBtn.disabled = this.currentPage === 1;
    nextBtn.disabled = this.currentPage === this.totalPages;

    prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
    nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.displayProducts();
      this.setupPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Focus on first product for accessibility
      setTimeout(() => {
        const firstProduct = document.querySelector('.product-card');
        if (firstProduct) firstProduct.focus();
      }, 100);
    }
  }

  updatePageInfo() {
    const pageInfo = document.getElementById('pageInfo');
    if (!pageInfo) return;

    const startIndex = (this.currentPage - 1) * this.PRODUCTS_PER_PAGE + 1;
    const endIndex = Math.min(this.currentPage * this.PRODUCTS_PER_PAGE, this.products.length);
    pageInfo.textContent = `${startIndex}-${endIndex} of ${this.products.length}`;
    pageInfo.setAttribute('aria-live', 'polite');
  }

  setupEventListeners() {
    // Use event delegation for dynamic elements
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const productId = card?.dataset?.productId;
      
      if (e.target.closest('.product-image') || e.target.closest('.product-name') || 
          e.target.closest('.view-details-btn')) {
        this.openProductModal(parseInt(productId));
      } else if (e.target.closest('.add-to-cart')) {
        this.addToCart(parseInt(productId));
      }
    });

    // Quantity controls
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.quantity-btn');
      if (!btn) return;
      
      const input = btn.parentElement.querySelector('.quantity-input');
      const productId = parseInt(input.dataset.productId);
      const action = btn.dataset.action;
      
      if (action === 'increase') {
        this.increaseQuantity(productId);
      } else if (action === 'decrease') {
        this.decreaseQuantity(productId);
      }
    });

    // Quantity input changes
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('quantity-input')) {
        const productId = parseInt(e.target.dataset.productId);
        const value = parseInt(e.target.value);
        this.updateQuantity(productId, value);
      }
    });

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  increaseQuantity(productId) {
    const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
    if (!input) return;

    let value = parseInt(input.value) + 1;
    if (value <= this.MAX_QUANTITY) {
      input.value = value;
      this.quantities[productId] = value;
    }
  }

  decreaseQuantity(productId) {
    const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
    if (!input) return;

    let value = parseInt(input.value) - 1;
    if (value >= this.MIN_QUANTITY) {
      input.value = value;
      this.quantities[productId] = value;
    }
  }

  updateQuantity(productId, value) {
    const numValue = parseInt(value);
    if (numValue >= this.MIN_QUANTITY && numValue <= this.MAX_QUANTITY) {
      this.quantities[productId] = numValue;
    } else {
      const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      if (input) {
        input.value = this.quantities[productId] || this.MIN_QUANTITY;
      }
    }
  }

  async addToCart(productId) {
    console.log('Adding to cart - Product ID:', productId);
    
    try {
      const product = this.products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const quantity = parseInt(this.quantities[productId]) || this.MIN_QUANTITY;
      console.log('Adding quantity:', quantity);
      
      // Get existing cart or initialize
      let cart = JSON.parse(localStorage.getItem('petalline-cart') || '{"items": []}');
      
      // Update cart
      const existingItemIndex = cart.items.findIndex(item => item.id === productId);
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ 
          ...product, 
          quantity: quantity,
          addedAt: Date.now()
        });
      }
      
      // Save to localStorage
      localStorage.setItem('petalline-cart', JSON.stringify(cart));
      
      // Update global cart data
      window.globalCartData = cart;
      
      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { 
          cartItems: cart.items,
          action: 'add',
          productId: productId,
          quantity: quantity
        }
      }));
      
      // Show success notification
      this.showCartNotification();
      
      // Reset quantity
      this.quantities[productId] = this.MIN_QUANTITY;
      const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      if (quantityInput) {
        quantityInput.value = this.MIN_QUANTITY;
      }

      console.log('Item successfully added to cart:', product.name);
      
    } catch (error) {
      console.error('Error adding item to cart:', error);
      this.showErrorNotification('Failed to add item to cart');
    }
  }

  setupModalListeners() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeProductModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeProductModal();
      }
    });
  }

  openProductModal(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      console.error('Product not found for modal:', productId);
      this.showErrorNotification('Product details not available');
      return;
    }
    this.displayProductModal(product);
  }

  displayProductModal(product) {
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    if (!modal || !modalContent) return;

    const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    modalContent.innerHTML = `
      <button class="modal-close" aria-label="Close product details" tabindex="0">&times;</button>
      <div class="product-detail-container">
        <div class="product-detail-image">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='./assets/placeholder.jpg'">
        </div>
        <div class="product-detail-info">
          <h2>${product.name}</h2>
          <div class="product-rating" aria-label="Rating: ${product.rating} out of 5">
            ${this.generateStars(product.rating)} (${product.reviews} reviews)
          </div>
          <div class="product-description">
            ${product.description}
          </div>
          <div class="benefits-section">
            <h3>Key Benefits</h3>
            <div class="benefits-grid">
              ${product.benefits.map(benefit => `
                <div class="benefit-item">
                  <i class="benefit-icon ${benefit.icon}" aria-hidden="true"></i>
                  <div class="benefit-content">
                    <h4>${benefit.title}</h4>
                    <p>${benefit.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="modal-purchase-section">
            <div class="modal-price-quantity">
              <div class="modal-total-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                ${product.discount ? `<span class="discount-percent">${discountPercent}% OFF</span>` : ''}
              </div>
              <div class="quantity-controls">
                <button class="quantity-btn" aria-label="Decrease quantity" data-modal-action="decrease">
                  <i class="fas fa-minus" aria-hidden="true"></i>
                </button>
                <input type="number" class="quantity-input modal-quantity-input" 
                       value="${this.MIN_QUANTITY}" min="${this.MIN_QUANTITY}" max="${this.MAX_QUANTITY}" 
                       aria-label="Quantity">
                <button class="quantity-btn" aria-label="Increase quantity" data-modal-action="increase">
                  <i class="fas fa-plus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <div class="modal-action-buttons">
              <button class="btn btn-primary" aria-label="Add to cart" data-modal-action="add-to-cart">
                <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                Add to Cart
              </button>
              <button class="btn btn-secondary" aria-label="Buy now" data-modal-action="buy-now">
                <i class="fas fa-bolt" aria-hidden="true"></i>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add modal event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => this.closeProductModal());
    
    // Modal quantity controls
    modal.addEventListener('click', (e) => {
      const btn = e.target.closest('.quantity-btn');
      if (!btn) return;
      
      const input = modal.querySelector('.modal-quantity-input');
      const action = btn.dataset.modalAction;
      
      if (action === 'increase') {
        input.stepUp();
      } else if (action === 'decrease') {
        input.stepDown();
      }
    });
    
    // Modal action buttons
    modal.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-modal-action]');
      if (!btn) return;
      
      const action = btn.dataset.modalAction;
      if (action === 'add-to-cart') {
        this.addToCartFromModal(product.id);
      } else if (action === 'buy-now') {
        this.buyNowFromModal(product.id);
      }
    });
    
    // Show modal
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    
    // Focus trap for accessibility
    this.setupModalFocusTrap(modal);
    
    // Focus on close button
    setTimeout(() => {
      modal.querySelector('.modal-close').focus();
    }, 100);
  }

  setupModalFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }

  closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    document.documentElement.style.paddingRight = '';
    
    // Return focus to the product that opened the modal
    const activeProductCard = document.activeElement.closest('.product-card');
    if (activeProductCard) {
      setTimeout(() => activeProductCard.focus(), 100);
    }
  }

  addToCartFromModal(productId) {
    try {
      const quantityInput = document.querySelector('.modal-quantity-input');
      if (!quantityInput) throw new Error('Quantity input not found');
      
      const quantity = parseInt(quantityInput.value) || this.MIN_QUANTITY;
      this.quantities[productId] = quantity;
      this.addToCart(productId);
      this.closeProductModal();
    } catch (error) {
      console.error('Error adding to cart from modal:', error);
      this.showErrorNotification('Failed to add item to cart');
    }
  }

  buyNowFromModal(productId) {
    this.addToCartFromModal(productId);
    setTimeout(() => {
      window.location.href = '/cart.html';
    }, 500);
  }

  showCartNotification() {
    const notification = document.getElementById('cartNotification');
    if (!notification) {
      console.error('Notification element not found');
      return;
    }
    
    notification.innerHTML = `
      <i class="fas fa-check-circle" aria-hidden="true"></i>
      Item added to cart!
    `;
    notification.style.backgroundColor = '';
    notification.classList.add('show');
    notification.setAttribute('aria-live', 'polite');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, this.NOTIFICATION_DURATION);
  }

  showErrorNotification(message) {
    const notification = document.getElementById('cartNotification');
    if (!notification) {
      console.error('Notification element not found');
      return;
    }
    
    const originalContent = notification.innerHTML;
    const originalStyle = notification.style.backgroundColor;
    
    notification.innerHTML = `
      <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
      ${message}
    `;
    notification.style.backgroundColor = '#ff4757';
    notification.classList.add('show');
    notification.setAttribute('aria-live', 'assertive');
    
    setTimeout(() => {
      notification.classList.remove('show');
      notification.innerHTML = originalContent;
      notification.style.backgroundColor = originalStyle;
    }, this.ERROR_NOTIFICATION_DURATION);
  }

  generateProducts() {
  return [
    {
      id: 1,
      name: "Dreamy Blue & White Bouquet",
      price: 89.99,
      originalPrice: 105.99,
      image: "./Assests/products/1.jpg",
      rating: 4.8,
      reviews: 127,
      description: "A dreamy arrangement of soft blue and white flowers wrapped in delicate tulle. Perfect for expressing gentle emotions and creating a romantic atmosphere.",
      benefits: [
        { icon: "fas fa-leaf", title: "Fresh & Long-lasting", desc: "Guaranteed to stay fresh for 7-10 days" },
        { icon: "fas fa-heart", title: "Romantic Appeal", desc: "Perfect for romantic occasions" },
        { icon: "fas fa-truck", title: "Same-Day Delivery", desc: "Order before 2 PM for same-day delivery" },
        { icon: "fas fa-gift", title: "Premium Wrapping", desc: "Elegant tulle and ribbon presentation" }
      ],
      category: "Mixed Bouquets",
      onSale: true,
      discount: 15
    },
    {
        id: 2,
        name: "Pink Rose Paradise Bouquet",
        price: 79.99,
        originalPrice: 94.99,
        image: "./Assests/products/2.jpg",
        rating: 4.7,
        reviews: 156,
        description: "Luxurious pink roses beautifully wrapped in soft pink paper with delicate ribbon. A symbol of grace, gratitude, and admiration.",
        benefits: [
            { icon: "fas fa-star", title: "Premium Quality", desc: "Hand-selected premium pink roses" },
            { icon: "fas fa-clock", title: "Long Lasting", desc: "Stays beautiful for up to 2 weeks" },
            { icon: "fas fa-home", title: "Home Delivery", desc: "Free delivery within city limits" },
            { icon: "fas fa-certificate", title: "Quality Guarantee", desc: "100% satisfaction guaranteed" }
        ],
        category: "Roses",
        onSale: true,
        discount: 16
    },
    {
        id: 3,
        name: "Purple Rose Elegance",
        price: 94.99,
        originalPrice: 110.99,
        image: "./Assests/products/3.jpg",
        rating: 4.9,
        reviews: 98,
        description: "Stunning purple roses wrapped in matching purple paper with a satin bow. Represents enchantment, mystery, and love at first sight.",
        benefits: [
            { icon: "fas fa-palette", title: "Unique Color", desc: "Rare purple rose variety" },
            { icon: "fas fa-seedling", title: "Fresh from Farm", desc: "Directly sourced from premium farms" },
            { icon: "fas fa-smile", title: "Mood Booster", desc: "Purple flowers enhance creativity" },
            { icon: "fas fa-recycle", title: "Eco-Friendly", desc: "Sustainably grown and packaged" }
        ],
        category: "Roses",
        onSale: true,
        discount: 14
    },
    {
        id: 4,
        name: "Sky Blue Rose Collection",
        price: 99.99,
        originalPrice: 119.99,
        image: "./Assests/products/4.jpg",
        rating: 4.6,
        reviews: 112,
        description: "Enchanting sky blue roses wrapped in coordinating blue paper. These unique roses symbolize mystery, impossibility, and dreams coming true.",
        benefits: [
            { icon: "fas fa-sun", title: "Unique Beauty", desc: "Rare blue roses for special occasions" },
            { icon: "fas fa-dollar-sign", title: "Premium Value", desc: "Exceptional quality at fair price" },
            { icon: "fas fa-users", title: "Perfect Gift", desc: "Unforgettable for loved ones" },
            { icon: "fas fa-leaf", title: "Special Treatment", desc: "Specially preserved for longevity" }
        ],
        category: "Roses",
        onSale: true,
        discount: 17
    },
    {
        id: 5,
        name: "Ocean Breeze Blue Bouquet",
        price: 74.99,
        originalPrice: 87.99,
        image: "./Assests/products/5.jpg",
        rating: 4.5,
        reviews: 134,
        description: "Fresh blue flowers wrapped in elegant blue paper with ribbon. Evokes feelings of tranquility, peace, and the calming essence of ocean waves.",
        benefits: [
            { icon: "fas fa-crown", title: "Calming Effect", desc: "Blue flowers promote relaxation" },
            { icon: "fas fa-calendar", title: "Versatile Gift", desc: "Perfect for any occasion" },
            { icon: "fas fa-award", title: "Artistically Arranged", desc: "Professional floral design" },
            { icon: "fas fa-spa", title: "Therapeutic", desc: "Known for stress-relieving properties" }
        ],
        category: "Mixed Bouquets",
        onSale: true,
        discount: 15
    },
    {
        id: 6,
        name: "Lavender Dream Bouquet",
        price: 84.99,
        originalPrice: 97.99,
        image: "./Assests/products/6.jpg",
        rating: 4.8,
        reviews: 87,
        description: "Exquisite purple and lavender flowers arranged in a sophisticated black box. Perfect for expressing admiration and creating an elegant atmosphere.",
        benefits: [
            { icon: "fas fa-sun", title: "Sophisticated Style", desc: "Elegant black box presentation" },
            { icon: "fas fa-expand", title: "Premium Arrangement", desc: "Professional floral artistry" },
            { icon: "fas fa-heart", title: "Emotional Impact", desc: "Creates lasting memories" },
            { icon: "fas fa-camera", title: "Photo Perfect", desc: "Instagram-worthy presentation" }
        ],
        category: "Premium Arrangements",
        onSale: true,
        discount: 13
    },
    {
        id: 7,
        name: "Pink Peony Paradise",
        price: 92.99,
        originalPrice: 109.99,
        image: "./Assests/products/7.jpg",
        rating: 4.7,
        reviews: 165,
        description: "Lush pink and white peonies wrapped in soft white paper with pink ribbon. Peonies symbolize honor, wealth, and a happy marriage.",
        benefits: [
            { icon: "fas fa-heart", title: "Symbol of Love", desc: "Perfect for romantic occasions" },
            { icon: "fas fa-clock", title: "Seasonal Beauty", desc: "Premium peony season flowers" },
            { icon: "fas fa-gift", title: "Luxury Feel", desc: "High-end floral experience" },
            { icon: "fas fa-star", title: "Customer Favorite", desc: "Highly rated by customers" }
        ],
        category: "Peonies",
        onSale: true,
        discount: 15
    },
    {
        id: 8,
        name: "Purple Carnation Delight",
        price: 64.99,
        originalPrice: 76.99,
        image: "./Assests/products/8.jpg",
        rating: 4.4,
        reviews: 143,
        description: "Beautiful purple and white carnations wrapped in coordinating purple paper. Carnations represent deep love, fascination, and distinction.",
        benefits: [
            { icon: "fas fa-dollar-sign", title: "Great Value", desc: "Beautiful flowers at affordable price" },
            { icon: "fas fa-clock", title: "Long Lasting", desc: "Carnations stay fresh for weeks" },
            { icon: "fas fa-palette", title: "Color Variety", desc: "Mixed purple and white tones" },
            { icon: "fas fa-home", title: "Perfect Size", desc: "Ideal for home decoration" }
        ],
        category: "Carnations",
        onSale: true,
        discount: 16
    },
    {
        id: 9,
        name: "Pink Carnation Elegance",
        price: 69.99,
        originalPrice: 82.99,
        image: "./Assests/products/9.jpg",
        rating: 4.6,
        reviews: 121,
        description: "Soft pink carnations beautifully arranged and wrapped with a delicate pink ribbon. Perfect for expressing gratitude and admiration.",
        benefits: [
            { icon: "fas fa-heart", title: "Gentle Expression", desc: "Perfect for showing appreciation" },
            { icon: "fas fa-leaf", title: "Fresh Quality", desc: "Hand-picked premium carnations" },
            { icon: "fas fa-smile", title: "Cheerful Gift", desc: "Brings joy to any recipient" },
            { icon: "fas fa-users", title: "Versatile Choice", desc: "Suitable for all ages" }
        ],
        category: "Carnations",
        onSale: true,
        discount: 16
    },
    {
        id: 10,
        name: "Baby's Breath Cloud",
        price: 54.99,
        originalPrice: 64.99,
        image: "./Assests/products/10.jpg",
        rating: 4.3,
        reviews: 89,
        description: "Delicate baby's breath arranged in a charming pink pot. Symbolizes everlasting love, purity, and new beginnings.",
        benefits: [
            { icon: "fas fa-seedling", title: "Symbol of Purity", desc: "Represents new beginnings" },
            { icon: "fas fa-home", title: "Potted Plant", desc: "Can be replanted for lasting beauty" },
            { icon: "fas fa-dollar-sign", title: "Affordable Luxury", desc: "Premium look at great price" },
            { icon: "fas fa-clock", title: "Long Lasting", desc: "Enjoys extended bloom period" }
        ],
        category: "Potted Arrangements",
        onSale: true,
        discount: 15
    },
    {
        id: 11,
        name: "White Baby's Breath Garden",
        price: 49.99,
        originalPrice: 59.99,
        image: "./Assests/products/11.jpg",
        rating: 4.2,
        reviews: 76,
        description: "Pure white baby's breath in decorative pots. Perfect for minimalist decor and representing innocence and pure love.",
        benefits: [
            { icon: "fas fa-home", title: "Home Decor", desc: "Perfect for modern minimalist style" },
            { icon: "fas fa-leaf", title: "Easy Care", desc: "Low maintenance potted plants" },
            { icon: "fas fa-recycle", title: "Reusable Pots", desc: "Beautiful decorative containers" },
            { icon: "fas fa-star", title: "Trendy Choice", desc: "Popular in modern arrangements" }
        ],
        category: "Potted Arrangements",
        onSale: true,
        discount: 17
    },
    {
        id: 12,
        name: "Sunny Gerbera Mix",
        price: 59.99,
        originalPrice: 71.99,
        image: "./Assests/products/12.jpg",
        rating: 4.5,
        reviews: 198,
        description: "Vibrant gerbera daisies in cheerful yellow and pink, wrapped in brown paper with pink ribbon. Represents happiness and cheerfulness.",
        benefits: [
            { icon: "fas fa-sun", title: "Bright & Cheerful", desc: "Instantly brightens any space" },
            { icon: "fas fa-smile", title: "Mood Booster", desc: "Scientifically proven to improve mood" },
            { icon: "fas fa-palette", title: "Vibrant Colors", desc: "Eye-catching color combination" },
            { icon: "fas fa-gift", title: "Perfect Gift", desc: "Ideal for birthdays and celebrations" }
        ],
        category: "Gerberas",
        onSale: true,
        discount: 17
    },
    {
        id: 13,
        name: "Rainbow Rose Celebration",
        price: 129.99,
        originalPrice: 149.99,
        image: "./Assests/products/13.jpg",
        rating: 4.9,
        reviews: 234,
        description: "Spectacular rainbow-colored roses in a clear vase with decorative patterned base. Each rose represents a different emotion and celebration of life's diversity.",
        benefits: [
            { icon: "fas fa-rainbow", title: "Unique Rainbow Colors", desc: "Each rose is a different vibrant color" },
            { icon: "fas fa-star", title: "Premium Quality", desc: "Specially treated rainbow roses" },
            { icon: "fas fa-home", title: "Includes Vase", desc: "Beautiful decorative glass vase included" },
            { icon: "fas fa-camera", title: "Show Stopper", desc: "Perfect conversation piece" }
        ],
        category: "Premium Arrangements",
        onSale: true,
        discount: 13
    },
    {
        id: 14,
        name: "Garden Fresh Mixed Bouquet",
        price: 74.99,
        originalPrice: 87.99,
        image: "./Assests/products/14.jpg",
        rating: 4.6,
        reviews: 156,
        description: "Fresh garden-style bouquet with roses, eucalyptus, and seasonal flowers in a kraft paper wrap. Represents natural beauty and organic elegance.",
        benefits: [
            { icon: "fas fa-leaf", title: "Garden Fresh", desc: "Straight from the garden feel" },
            { icon: "fas fa-recycle", title: "Eco-Friendly", desc: "Sustainable kraft paper wrapping" },
            { icon: "fas fa-seedling", title: "Mixed Varieties", desc: "Diverse selection of flowers" },
            { icon: "fas fa-heart", title: "Natural Beauty", desc: "Organic, unstructured arrangement" }
        ],
        category: "Garden Style",
        onSale: true,
        discount: 15
    },
    {
        id: 15,
        name: "Sunflower Symphony",
        price: 84.99,
        originalPrice: 99.99,
        image: "./Assests/products/15.jpg",
        rating: 4.7,
        reviews: 187,
        description: "Cheerful sunflowers mixed with colorful seasonal blooms in a glass vase. Represents adoration, loyalty, and sunny disposition.",
        benefits: [
            { icon: "fas fa-sun", title: "Symbol of Happiness", desc: "Sunflowers represent joy and positivity" },
            { icon: "fas fa-expand", title: "Large Blooms", desc: "Impressive size and visual impact" },
            { icon: "fas fa-home", title: "Includes Vase", desc: "Ready to display glass vase" },
            { icon: "fas fa-clock", title: "Long Lasting", desc: "Sunflowers have excellent vase life" }
        ],
        category: "Sunflowers",
        onSale: true,
        discount: 15
    },
    {
        id: 16,
        name: "Yellow Rose & Blue Accent",
        price: 89.99,
        originalPrice: 104.99,
        image: "./Assests/products/16.jpg",
        rating: 4.8,
        reviews: 143,
        description: "Bright yellow roses with blue accent flowers in a sunny yellow box. Yellow roses symbolize friendship, joy, and new beginnings.",
        benefits: [
            { icon: "fas fa-sun", title: "Bright & Uplifting", desc: "Yellow roses bring joy and warmth" },
            { icon: "fas fa-users", title: "Friendship Symbol", desc: "Perfect for celebrating friendships" },
            { icon: "fas fa-gift", title: "Gift Box Included", desc: "Beautiful yellow presentation box" },
            { icon: "fas fa-palette", title: "Color Harmony", desc: "Perfect yellow and blue combination" }
        ],
        category: "Roses",
        onSale: true,
        discount: 14
    },
    {
        id: 17,
        name: "Golden Elegance Box",
        price: 119.99,
        originalPrice: 139.99,
        image: "./Assests/products/17.jpg",
        rating: 4.9,
        reviews: 98,
        description: "Luxurious red and yellow roses arranged in an elegant golden box. Represents passion, friendship, and the perfect balance of love and joy.",
        benefits: [
            { icon: "fas fa-crown", title: "Luxury Collection", desc: "Premium golden box presentation" },
            { icon: "fas fa-heart", title: "Mixed Emotions", desc: "Combines passion and friendship" },
            { icon: "fas fa-gift", title: "Reusable Box", desc: "Beautiful keepsake golden box" },
            { icon: "fas fa-star", title: "Premium Roses", desc: "Top quality red and yellow roses" }
        ],
        category: "Premium Arrangements",
        onSale: true,
        discount: 14
    },
    {
        id: 18,
        name: "Creamy Yellow Rose Luxury",
        price: 104.99,
        originalPrice: 122.99,
        image: "./Assests/products/18.jpg",
        rating: 4.8,
        reviews: 167,
        description: "Elegant cream and yellow roses in a pristine white hat box. Represents grace, elegance, and sophisticated beauty.",
        benefits: [
            { icon: "fas fa-crown", title: "Sophisticated Style", desc: "Elegant white hat box presentation" },
            { icon: "fas fa-star", title: "Premium Quality", desc: "Hand-selected cream roses" },
            { icon: "fas fa-home", title: "Luxury Display", desc: "Perfect for upscale environments" },
            { icon: "fas fa-gift", title: "Special Occasion", desc: "Ideal for milestone celebrations" }
        ],
        category: "Premium Arrangements",
        onSale: true,
        discount: 15
    },
    {
        id: 19,
        name: "Autumn Sunflower Collection",
        price: 94.99,
        originalPrice: 112.99,
        image: "./Assests/products/19.jpg",
        rating: 4.6,
        reviews: 178,
        description: "Warm sunflowers with orange roses in a sophisticated black box. Perfect autumn arrangement representing warmth, abundance, and harvest joy.",
        benefits: [
            { icon: "fas fa-leaf", title: "Autumn Colors", desc: "Perfect fall color palette" },
            { icon: "fas fa-sun", title: "Warm & Inviting", desc: "Creates cozy autumn atmosphere" },
            { icon: "fas fa-gift", title: "Elegant Box", desc: "Sophisticated black presentation box" },
            { icon: "fas fa-home", title: "Seasonal Decor", desc: "Perfect for autumn decorating" }
        ],
        category: "Seasonal Arrangements",
        onSale: true,
        discount: 16
    },
    {
        id: 20,
        name: "Golden Sunshine Bundle",
        price: 79.99,
        originalPrice: 93.99,
        image: "./Assests/products/20.jpg",
        rating: 4.5,
        reviews: 145,
        description: "Bright yellow sunflowers and roses wrapped in yellow paper with matching ribbon. Brings the warmth and energy of sunshine indoors.",
        benefits: [
            { icon: "fas fa-sun", title: "Sunshine Energy", desc: "Brings warmth and positive energy" },
            { icon: "fas fa-smile", title: "Mood Enhancer", desc: "Yellow flowers boost happiness" },
            { icon: "fas fa-dollar-sign", title: "Great Value", desc: "Premium flowers at fair price" },
            { icon: "fas fa-users", title: "Universal Appeal", desc: "Perfect gift for anyone" }
        ],
        category: "Sunflowers",
        onSale: true,
        discount: 15
    },
    {
        id: 21,
        name: "Vibrant Mixed Garden Bouquet",
        price: 89.99,
        originalPrice: 105.99,
        image: "./Assests/products/21.jpg",
        rating: 4.7,
        reviews: 203,
        description: "Spectacular mix of purple, orange, pink, and yellow flowers creating a vibrant garden-style bouquet. Celebrates the diversity and beauty of nature.",
        benefits: [
            { icon: "fas fa-palette", title: "Rainbow Colors", desc: "Full spectrum of vibrant colors" },
            { icon: "fas fa-seedling", title: "Garden Variety", desc: "Multiple flower types and textures" },
            { icon: "fas fa-heart", title: "Emotional Impact", desc: "Creates joy and wonder" },
            { icon: "fas fa-camera", title: "Photo Ready", desc: "Perfect for special photos" }
        ],
        category: "Mixed Bouquets",
        onSale: true,
        discount: 15
    },
    {
        id: 22,
        name: "Peach Rose Elegance",
        price: 99.99,
        originalPrice: 117.99,
        image: "./Assests/products/22.jpg",
        rating: 4.8,
        reviews: 134,
        description: "Soft peach and coral roses arranged in a decorative copper vase. Represents appreciation, sincerity, and genuine feelings.",
        benefits: [
            { icon: "fas fa-heart", title: "Warm Feelings", desc: "Peach roses express sincere emotions" },
            { icon: "fas fa-home", title: "Decorative Vase", desc: "Beautiful copper-toned vase included" },
            { icon: "fas fa-star", title: "Unique Color", desc: "Rare peach rose variety" },
            { icon: "fas fa-clock", title: "Long Lasting", desc: "Roses maintain beauty for weeks" }
        ],
        category: "Roses",
        onSale: true,
        discount: 15
    },
    {
        id: 23,
        name: "Blue & White Elegance",
        price: 109.99,
        originalPrice: 127.99,
        image: "./Assests/products/23.jpg",
        rating: 4.9,
        reviews: 87,
        description: "Stunning blue and white flowers in an ornate blue and white porcelain vase. Represents tranquility, peace, and timeless elegance.",
        benefits: [
            { icon: "fas fa-crown", title: "Porcelain Vase", desc: "Elegant blue and white porcelain" },
            { icon: "fas fa-spa", title: "Calming Colors", desc: "Blue and white promote serenity" },
            { icon: "fas fa-home", title: "Decorative Art", desc: "Functions as home decor piece" },
            { icon: "fas fa-gift", title: "Heirloom Quality", desc: "Vase becomes treasured keepsake" }
        ],
        category: "Premium Arrangements",
        onSale: true,
        discount: 14
    },
    {
        id: 24,
        name: "Purple & White Rose Elegance",
        price: 94.99,
        originalPrice: 110.99,
        image: "./Assests/products/24.jpg",
        rating: 4.7,
        reviews: 156,
        description: "Sophisticated purple and white roses with eucalyptus, wrapped in deep purple paper with ribbon. Represents admiration and respect.",
        benefits: [
            { icon: "fas fa-star", title: "Color Contrast", desc: "Beautiful purple and white contrast" },
            { icon: "fas fa-leaf", title: "Eucalyptus Accent", desc: "Fresh eucalyptus adds fragrance" },
            { icon: "fas fa-heart", title: "Sophisticated Gift", desc: "Perfect for elegant occasions" },
            { icon: "fas fa-crown", title: "Premium Roses", desc: "Top quality rose varieties" }
        ],
        category: "Roses",
        onSale: true,
        discount: 14
    },
    {
        id: 25,
        name: "Blue & White Lily Arrangement",
        price: 87.99,
        originalPrice: 102.99,
        image: "./Assests/products/25.jpg",
        rating: 4.6,
        reviews: 123,
        description: "Fresh blue and white lilies in a deep blue vase. Lilies symbolize purity, rebirth, and the restored innocence of the soul.",
        benefits: [
            { icon: "fas fa-star", title: "Symbol of Purity", desc: "Lilies represent pure intentions" },
            { icon: "fas fa-home", title: "Beautiful Vase", desc: "Deep blue ceramic vase included" },
            { icon: "fas fa-clock", title: "Long Blooming", desc: "Lilies have extended bloom time" },
            { icon: "fas fa-spa", title: "Fresh Fragrance", desc: "Natural lily fragrance" }
        ],
        category: "Lilies",
        onSale: true,
        discount: 15
    },
    {
        id: 26,
        name: "Pink & White Lily Paradise",
        price: 92.99,
        originalPrice: 108.99,
        image: "./Assests/products/26.jpg",
        rating: 4.8,
        reviews: 167,
        description: "Elegant pink lilies and white roses in a clear crystal vase. Combines the purity of lilies with the love symbolized by roses.",
        benefits: [
            { icon: "fas fa-heart", title: "Love & Purity", desc: "Perfect combination of roses and lilies" },
            { icon: "fas fa-gem", title: "Crystal Vase", desc: "High-quality crystal vase included" },
            { icon: "fas fa-star", title: "Premium Flowers", desc: "Hand-selected lilies and roses" },
            { icon: "fas fa-home", title: "Elegant Display", desc: "Perfect for sophisticated spaces" }
        ],
        category: "Mixed Arrangements",
        onSale: true,
        discount: 15
    },
    {
        id: 27,
        name: "Pink Lily & Calla Lily Mix",
        price: 104.99,
        originalPrice: 122.99,
        image: "./Assests/products/27.jpg",
        rating: 4.9,
        reviews: 98,
        description: "Stunning pink lilies and white calla lilies in a tall glass vase. Calla lilies represent magnificent beauty and sophisticated elegance.",
        benefits: [
            { icon: "fas fa-crown", title: "Sophisticated Mix", desc: "Lilies and calla lilies combination" },
            { icon: "fas fa-expand", title: "Tall Arrangement", desc: "Impressive height and presence" },
            { icon: "fas fa-star", title: "Premium Varieties", desc: "High-end lily varieties" },
            { icon: "fas fa-home", title: "Statement Piece", desc: "Perfect centerpiece arrangement" }
        ],
        category: "Lilies",
        onSale: true,
        discount: 15
    },
    {
        id: 28,
        name: "Pink & White Mixed Bouquet",
        price: 79.99,
        originalPrice: 94.99,
        image: "./Assests/products/28.jpg",
        rating: 4.6,
        reviews: 145,
        description: "Cheerful pink gerberas and white roses in a clear glass vase. This vibrant arrangement combines the joy of gerberas with the elegance of roses.",
        benefits: [
            { icon: "fas fa-smile", title: "Joyful Colors", desc: "Pink and white create cheerful atmosphere" },
            { icon: "fas fa-heart", title: "Mixed Emotions", desc: "Combines joy and pure love" },
            { icon: "fas fa-home", title: "Glass Vase", desc: "Clear glass vase included" },
            { icon: "fas fa-gift", title: "Perfect Gift", desc: "Ideal for celebrations and birthdays" }
        ],
        category: "Mixed Arrangements",
        onSale: true,
        discount: 16
    },
    {
        id: 29,
        name: "Pure White Rose Bouquet",
        price: 114.99,
        originalPrice: 134.99,
        image: "./Assests/products/29.jpg",
        rating: 4.9,
        reviews: 187,
        description: "Luxurious pure white roses wrapped in elegant white paper with pearl accents and white ribbon. Represents purity, new beginnings, and eternal love.",
        benefits: [
            { icon: "fas fa-crown", title: "Premium White Roses", desc: "Highest quality white rose variety" },
            { icon: "fas fa-gem", title: "Pearl Accents", desc: "Beautiful pearl decorations" },
            { icon: "fas fa-heart", title: "Symbol of Purity", desc: "Perfect for weddings and special occasions" },
            { icon: "fas fa-star", title: "Elegant Wrapping", desc: "Sophisticated white paper presentation" }
        ],
        category: "Premium Arrangements",
        onSale: true,
        discount: 15
    },
    {
        id: 30,
        name: "Mixed Color Rose & Daisy Bouquet",
        price: 89.99,
        originalPrice: 105.99,
        image: "./Assests/products/30.jpg",
        rating: 4.7,
        reviews: 198,
        description: "Vibrant mix of red roses, cream roses, and white daisies wrapped in brown kraft paper with red ribbon. A rustic yet elegant combination celebrating diversity.",
        benefits: [
            { icon: "fas fa-palette", title: "Color Variety", desc: "Beautiful mix of reds, creams, and whites" },
            { icon: "fas fa-recycle", title: "Rustic Style", desc: "Eco-friendly kraft paper wrapping" },
            { icon: "fas fa-heart", title: "Mixed Symbolism", desc: "Combines passion, purity, and innocence" },
            { icon: "fas fa-users", title: "Versatile Gift", desc: "Perfect for various occasions" }
        ],
        category: "Mixed Bouquets",
        onSale: true,
        discount: 15
    },
    {
        id: 31,
        name: "Wildflower Garden Bouquet",
        price: 74.99,
        originalPrice: 87.99,
        image: "./Assests/products/31.jpg",
        rating: 4.5,
        reviews: 156,
        description: "Natural wildflower arrangement with pink, yellow, and purple blooms wrapped in beige burlap. Evokes the beauty of a countryside meadow.",
        benefits: [
            { icon: "fas fa-seedling", title: "Natural Style", desc: "Authentic wildflower garden feel" },
            { icon: "fas fa-leaf", title: "Diverse Blooms", desc: "Multiple flower varieties and textures" },
            { icon: "fas fa-recycle", title: "Burlap Wrap", desc: "Eco-friendly natural burlap wrapping" },
            { icon: "fas fa-sun", title: "Country Charm", desc: "Brings countryside beauty indoors" }
        ],
        category: "Garden Style",
        onSale: true,
        discount: 15
    },
    {
        id: 32,
        name: "Pink Rose Ball Bouquet",
        price: 124.99,
        originalPrice: 146.99,
        image: "./Assests/products/32.jpg",
        rating: 4.8,
        reviews: 123,
        description: "Stunning compact pink roses arranged in a perfect sphere shape with baby's breath accents, wrapped in soft pink paper. A modern take on classic elegance.",
        benefits: [
            { icon: "fas fa-crown", title: "Sphere Design", desc: "Unique compact ball arrangement" },
            { icon: "fas fa-star", title: "Perfect Shape", desc: "Professionally structured rose ball" },
            { icon: "fas fa-heart", title: "Romantic Pink", desc: "Soft pink roses express tender love" },
            { icon: "fas fa-gift", title: "Special Occasion", desc: "Perfect for anniversaries and proposals" }
        ],
        category: "Premium Arrangements",
        onSale: true,
        discount: 15
    },
    {
        id: 33,
        name: "Pink Peony & Rose Elegance",
        price: 109.99,
        originalPrice: 128.99,
        image: "./Assests/products/33.jpg",
        rating: 4.9,
        reviews: 167,
        description: "Luxurious pink peonies and roses wrapped in elegant black paper with pink ribbon. This sophisticated arrangement combines two of the most beloved flowers.",
        benefits: [
            { icon: "fas fa-crown", title: "Luxury Flowers", desc: "Premium peonies and roses combination" },
            { icon: "fas fa-palette", title: "Elegant Contrast", desc: "Beautiful black wrapping with pink blooms" },
            { icon: "fas fa-heart", title: "Double Beauty", desc: "Two most romantic flower types" },
            { icon: "fas fa-star", title: "Premium Quality", desc: "Hand-selected seasonal peonies" }
        ],
        category: "Premium Arrangements",
        onSale: true,
        discount: 15
    },
    {
        id: 34,
        name: "Single Pink Gerbera Delight",
        price: 34.99,
        originalPrice: 42.99,
        image: "./Assests/products/34.jpg",
        rating: 4.4,
        reviews: 89,
        description: "Simple yet beautiful single pink gerbera daisy wrapped in soft pink paper with blue ribbon accent. Perfect for small gestures and everyday joy.",
        benefits: [
            { icon: "fas fa-dollar-sign", title: "Affordable Joy", desc: "Beautiful flower at great price" },
            { icon: "fas fa-smile", title: "Simple Happiness", desc: "Single bloom brings instant joy" },
            { icon: "fas fa-gift", title: "Perfect Size", desc: "Ideal for small gestures" },
            { icon: "fas fa-heart", title: "Thoughtful Gift", desc: "Shows care and consideration" }
        ],
        category: "Single Stems",
        onSale: true,
        discount: 19
    },
    {
        id: 35,
        name: "Orange Tulip Bunch",
        price: 64.99,
        originalPrice: 76.99,
        image: "./Assests/products/35.jpg",
        rating: 4.6,
        reviews: 134,
        description: "Fresh orange tulips wrapped in kraft paper with brown ribbon. Tulips represent perfect love and elegance, bringing spring's freshness indoors.",
        benefits: [
            { icon: "fas fa-sun", title: "Spring Fresh", desc: "Bright orange tulips bring spring energy" },
            { icon: "fas fa-clock", title: "Seasonal Beauty", desc: "Fresh tulips from premium growers" },
            { icon: "fas fa-recycle", title: "Natural Wrap", desc: "Eco-friendly kraft paper packaging" },
            { icon: "fas fa-heart", title: "Perfect Love", desc: "Tulips symbolize perfect love" }
        ],
        category: "Tulips",
        onSale: true,
        discount: 16
    },
    {
      id: 36,
      name: "Sunflower & Wildflower Mix",
      price: 84.99,
      originalPrice: 99.99,
      image: "./Assests/products/36.jpg",
      rating: 4.7,
      reviews: 176,
      description: "Cheerful sunflowers mixed with colorful wildflowers in kraft paper wrapping. This rustic arrangement brings the joy of summer fields to any space.",
      benefits: [
        { icon: "fas fa-sun", title: "Sunshine Joy", desc: "Sunflowers bring warmth and happiness" },
        { icon: "fas fa-seedling", title: "Wild Beauty", desc: "Natural wildflower varieties included" },
        { icon: "fas fa-recycle", title: "Rustic Style", desc: "Natural kraft paper presentation" },
        { icon: "fas fa-smile", title: "Mood Booster", desc: "Guaranteed to brighten any day" }
      ],
      category: "Sunflowers",
      onSale: true,
      discount: 15
    }
  ];
}
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    const productManager = new ProductManager();
    // Assign to window only if needed for debugging
    if (process.env.NODE_ENV === 'development') {
      window.productManager = productManager;
    }
  } 
  catch (error) {
    console.error('Failed to initialize product manager:', error);
    const errorElement = document.createElement('div');
    // errorElement.className = 'error-message';
    // errorElement.textContent = 'We\'re having trouble loading our products. Please try again later.';
    document.body.prepend(errorElement);
  }
});