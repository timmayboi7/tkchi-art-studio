/**
 * Art Studio Website - Main JavaScript
 * ================================
 * 
 * This file contains all interactive functionality for the art studio website:
 * - Gallery modal system for viewing artwork
 * - Shopping cart with localStorage persistence
 * - Mobile navigation toggle
 * - Active navigation highlighting
 * - Smooth scrolling for anchor links
 * 
 * All functions handle missing DOM elements gracefully to prevent crashes
 * on pages that don't have certain features (cart, gallery, etc.)
 */

'use strict';

// ============================================================================
// GLOBAL CART STATE
// ============================================================================

/**
 * Global cart array containing items as objects: {name, price, id}
 * This is populated from localStorage on page load
 */
let cart = [];

// ============================================================================
// GALLERY MODAL SYSTEM
// ============================================================================

/**
 * Opens the modal with a full-size image and optional caption.
 * Expected DOM elements:
 *   - #modal-overlay: The modal background/container
 *   - #modal-image: The <img> element inside the modal
 *   - #modal-caption: The caption text element (optional)
 *   - #modal-close: The close button
 * 
 * @param {string} imageSrc - URL/path to the full-size image
 * @param {string} [caption] - Optional caption text for the image
 */
function openModal(imageSrc, caption) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');

    // Validate required elements exist
    if (!modalOverlay) {
        console.warn('Modal overlay (#modal-overlay) not found');
        return;
    }
    if (!modalImage) {
        console.warn('Modal image (#modal-image) not found');
        return;
    }

    // Set the image source
    modalImage.src = imageSrc;

    // Set caption if provided and element exists
    if (modalCaption) {
        if (caption) {
            modalCaption.textContent = caption;
            modalCaption.style.display = 'block';
        } else {
            modalCaption.style.display = 'none';
        }
    }

    // Show the modal
    modalOverlay.style.display = 'flex';
    
    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';

    // Focus the close button for accessibility
    const closeButton = document.getElementById('modal-close');
    if (closeButton) {
        closeButton.focus();
    }
}

/**
 * Closes the modal and restores normal page behavior.
 * Clears the image source to prevent flash of old image on next open.
 */
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalImage = document.getElementById('modal-image');

    if (!modalOverlay) {
        console.warn('Modal overlay (#modal-overlay) not found');
        return;
    }

    // Hide the modal
    modalOverlay.style.display = 'none';
    
    // Restore background scrolling
    document.body.style.overflow = '';

    // Clear the image source to prevent showing old image briefly on next open
    if (modalImage) {
        modalImage.src = '';
    }
}

/**
 * Sets up gallery click handlers for elements with .gallery-item class.
 * Expected data attributes:
 *   - data-full: URL to full-size image
 *   - data-caption: (optional) Caption text for the image
 */
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryItems.length === 0) {
        // No gallery on this page - that's fine, no warning needed
        return;
    }

    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const fullImageSrc = item.getAttribute('data-full');
            const caption = item.getAttribute('data-caption');

            if (fullImageSrc) {
                openModal(fullImageSrc, caption);
            } else {
                console.warn('Gallery item missing data-full attribute', item);
            }
        });
    });

    // Set up modal close handlers
    setupModalCloseHandlers();
}

/**
 * Sets up all the ways to close the modal:
 * - Clicking the close button
 * - Clicking outside the image (on the overlay)
 * - Pressing the Escape key
 */
function setupModalCloseHandlers() {
    const modalOverlay = document.getElementById('modal-overlay');
    const closeButton = document.getElementById('modal-close');

    // Close button click
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Click outside image closes modal
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(event) {
            // Only close if clicking the overlay itself, not the image
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Escape key closes modal (focus trap for accessibility)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modalOverlay = document.getElementById('modal-overlay');
            if (modalOverlay && modalOverlay.style.display === 'flex') {
                closeModal();
            }
        }
    });
}

// ============================================================================
// SHOPPING CART SYSTEM
// ============================================================================

/**
 * Loads cart data from localStorage.
 * Expected localStorage key: 'artStudioCart'
 * 
 * Handles localStorage unavailability gracefully by:
 * - Using try/catch around all storage operations
 * - Falling back to empty cart if storage fails
 * - Silently continuing without persistence if localStorage is unavailable
 */
function loadCart() {
    try {
        // Check if localStorage is available
        if (typeof Storage === 'undefined' || !window.localStorage) {
            console.warn('localStorage not available - cart will not persist between sessions');
            cart = [];
            return;
        }

        const storedCart = localStorage.getItem('artStudioCart');
        
        if (storedCart) {
            // Parse the stored JSON
            const parsedCart = JSON.parse(storedCart);
            
            // Validate that parsed data is an array
            if (Array.isArray(parsedCart)) {
                cart = parsedCart;
            } else {
                console.warn('Invalid cart data in localStorage, starting with empty cart');
                cart = [];
            }
        } else {
            // No cart stored yet
            cart = [];
        }
    } catch (error) {
        // Handle any errors (privacy mode, storage full, etc.)
        console.warn('Failed to load cart from localStorage:', error.message);
        cart = [];
    }
}

/**
 * Saves the current cart to localStorage.
 * Uses try/catch to handle cases where localStorage is unavailable.
 */
function saveCart() {
    try {
        if (typeof Storage === 'undefined' || !window.localStorage) {
            // localStorage not available - cart will work for this session only
            return;
        }

        localStorage.setItem('artStudioCart', JSON.stringify(cart));
    } catch (error) {
        console.warn('Failed to save cart to localStorage:', error.message);
        // Cart operations continue to work for this session even if save fails
    }
}

/**
 * Adds an item to the cart.
 * 
 * Expected button data attributes:
 *   - data-name: Name of the artwork/item
 *   - data-price: Price as a number (will be parsed)
 * 
 * @param {string} name - Name of the item to add
 * @param {number|string} price - Price of the item
 */
function addToCart(name, price) {
    // Validate inputs
    if (!name) {
        console.warn('Cannot add item to cart: missing name');
        return;
    }

    // Parse price to number if it's a string
    const parsedPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(parsedPrice) || parsedPrice < 0) {
        console.warn('Cannot add item to cart: invalid price', price);
        return;
    }

    // Create unique ID for this cart item (timestamp-based)
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);

    // Create cart item object
    const cartItem = {
        name: name,
        price: parsedPrice,
        id: id
    };

    // Add to cart array
    cart.push(cartItem);

    // Save to localStorage
    saveCart();

    // Update the UI
    updateCartUI();

    // Visual feedback
    showCartFeedback(name);
}

/**
 * Shows visual feedback when item is added to cart.
 * @param {string} itemName - Name of the item added
 */
function showCartFeedback(itemName) {
    // You can customize this - for now just a console log
    // This could be extended to show a toast notification
    console.log('Added to cart:', itemName);
}

/**
 * Removes an item from the cart by its index.
 * 
 * @param {number} index - Index of the item in the cart array
 */
function removeItem(index) {
    // Validate index
    if (typeof index !== 'number' || index < 0 || index >= cart.length) {
        console.warn('Cannot remove item: invalid index', index);
        return;
    }

    // Remove the item at the specified index
    cart.splice(index, 1);

    // Save to localStorage
    saveCart();

    // Update the UI
    updateCartUI();
}

/**
 * Clears all items from the cart.
 * Confirms with user before clearing if cart is not empty.
 */
function clearCart() {
    if (cart.length === 0) {
        // Cart is already empty, nothing to do
        return;
    }

    // Confirm before clearing
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartUI();
    }
}

/**
 * Updates the cart UI elements with current cart data.
 * Expected DOM elements:
 *   - #cart-table: The table or container for cart items
 *   - #cart-total: Element to display the total price
 * 
 * Creates HTML content for cart items with remove buttons.
 */
function updateCartUI() {
    const cartTable = document.getElementById('cart-table');
    const cartTotalElement = document.getElementById('cart-total');

    // If cart elements don't exist on this page, exit silently
    if (!cartTable) {
        return;
    }

    // Clear existing content
    cartTable.innerHTML = '';

    // Handle empty cart
    if (cart.length === 0) {
        cartTable.innerHTML = '<tr><td colspan="3" class="cart-empty">Your cart is empty</td></tr>';
        
        if (cartTotalElement) {
            cartTotalElement.textContent = 'Total: $0.00';
        }
        return;
    }

    // Build cart items HTML
    cart.forEach(function(item, index) {
        const row = document.createElement('tr');
        
        // Item name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        nameCell.className = 'cart-item-name';
        row.appendChild(nameCell);

        // Price cell
        const priceCell = document.createElement('td');
        priceCell.textContent = '$' + item.price.toFixed(2);
        priceCell.className = 'cart-item-price';
        row.appendChild(priceCell);

        // Remove button cell
        const actionCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-btn';
        removeButton.setAttribute('data-index', index);
        removeButton.setAttribute('aria-label', 'Remove ' + item.name + ' from cart');
        
        // Add click handler for remove
        removeButton.addEventListener('click', function() {
            removeItem(index);
        });
        
        actionCell.appendChild(removeButton);
        actionCell.className = 'cart-item-action';
        row.appendChild(actionCell);

        cartTable.appendChild(row);
    });

    // Update total
    if (cartTotalElement) {
        const total = cart.reduce(function(sum, item) {
            return sum + item.price;
        }, 0);
        
        cartTotalElement.textContent = 'Total: $' + total.toFixed(2);
    }
}

/**
 * Sets up event listeners for "Add to Cart" buttons.
 * Expected button attributes:
 *   - class: .add-to-cart
 *   - data-name: Name of the item
 *   - data-price: Price of the item
 */
function initCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    if (addToCartButtons.length === 0) {
        // No add-to-cart buttons on this page - that's fine
        return;
    }

    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');

            if (!name || !price) {
                console.warn('Add to cart button missing data-name or data-price', button);
                return;
            }

            addToCart(name, price);
        });
    });
}

/**
 * Placeholder for checkout functionality.
 * Shows an alert indicating checkout is not yet implemented.
 */
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert('Checkout functionality coming soon!');
}

/**
 * Sets up the checkout button if it exists on the page.
 */
function initCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-btn');
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }

    // Also look for clear cart button
    const clearCartButton = document.getElementById('clear-cart-btn');
    
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }
}

// ============================================================================
// MOBILE NAVIGATION
// ============================================================================

/**
 * Initializes mobile navigation toggle functionality.
 * Expected DOM elements:
 *   - #nav-toggle: The hamburger menu button
 *   - #main-nav: The navigation menu container
 * 
 * Toggles 'active' class on the nav menu when hamburger is clicked.
 * Closes menu when any nav link is clicked.
 */
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (!navToggle || !mainNav) {
        // Mobile nav elements not found on this page - that's fine
        return;
    }

    // Toggle menu on hamburger click
    navToggle.addEventListener('click', function() {
        const isExpanded = mainNav.classList.contains('active');
        
        mainNav.classList.toggle('active');
        
        // Update ARIA attribute for accessibility
        navToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle hamburger animation class if using CSS animation
        navToggle.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    const navLinks = mainNav.querySelectorAll('a');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Only close if mobile menu is active (visible)
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// ============================================================================
// ACTIVE NAVIGATION STATE
// ============================================================================

/**
 * Sets the active state on the current page's navigation link.
 * Determines current page from window.location.pathname and adds 'active'
 * class to the corresponding nav link.
 */
function setActiveNav() {
    const mainNav = document.getElementById('main-nav');
    
    if (!mainNav) {
        return;
    }

    const navLinks = mainNav.querySelectorAll('a');
    
    if (navLinks.length === 0) {
        return;
    }

    // Get current page path
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    navLinks.forEach(function(link) {
        // Remove active class from all links first
        link.classList.remove('active');

        // Get the href from the link
        const linkHref = link.getAttribute('href') || '';
        const linkPage = linkHref.split('/').pop() || 'index.html';

        // Check if this link matches the current page
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
        
        // Special case for home page
        if ((currentPage === '' || currentPage === '/') && 
            (linkPage === 'index.html' || linkPage === '' || linkHref === '/')) {
            link.classList.add('active');
        }
    });
}

// ============================================================================
// SMOOTH SCROLL
// ============================================================================

/**
 * Initializes smooth scrolling for anchor links.
 * When an anchor link is clicked, smoothly scrolls to the target element.
 * Respects reduced motion preferences for accessibility.
 */
function initSmoothScroll() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Don't enable smooth scroll if user prefers reduced motion
        return;
    }

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    if (anchorLinks.length === 0) {
        return;
    }

    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#" (common placeholder)
            if (href === '#') {
                return;
            }

            // Find the target element
            const target = document.querySelector(href);

            if (target) {
                // Prevent default jump behavior
                event.preventDefault();

                // Get header height for offset (if fixed header exists)
                const header = document.querySelector('header');
                const headerOffset = header ? header.offsetHeight : 0;

                // Calculate scroll position
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

                // Smooth scroll to target
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// ============================================================================
// FORM HANDLING (OPTIONAL ENHANCEMENT)
// ============================================================================

/**
 * Sets up form validation enhancements if forms exist on the page.
 * Prevents form submission if required fields are empty.
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (!isValid) {
                event.preventDefault();
                // Focus the first invalid field
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Main initialization function called when DOM is ready.
 * Sets up all interactive features.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation features
    initMobileNav();
    setActiveNav();
    initSmoothScroll();

    // Initialize gallery modal if gallery exists
    initGalleryModal();

    // Initialize cart system
    loadCart();
    updateCartUI();
    initCartButtons();
    initCheckoutButton();

    // Initialize form validation if forms exist
    initFormValidation();

    // Log initialization complete (helpful for debugging)
    console.log('Art Studio site initialized');
});
