// Product Data
// We use descriptive placeholder image URLs for visual feedback if actual images missing
const products = [
    {
        id: 'p1',
        name: 'Premium Whole Chicken',
        price: 18.99,
        description: 'Locally raised, free-roaming whole chicken. Perfect for roasting. Approx 1.5kg.',
        image: 'assets/whole_chicken.png',
        skinOptions: ['With Skin', 'Skinless'],
        cutOptions: ['Whole', 'Cut into 2 Pieces', 'Cut into 4 Pieces', 'Cut into 8 Pieces', 'Cut into 12 Pieces']
    },
    {
        id: 'p2',
        name: 'Organic Free Range Chicken',
        price: 24.50,
        description: 'Certified organic, pasture-raised chicken. Exceptional flavor and texture.',
        image: 'assets/free_range_chicken.png',
        skinOptions: ['With Skin', 'Skinless'],
        cutOptions: ['Whole', 'Cut into 2 Pieces', 'Cut into 4 Pieces', 'Cut into 8 Pieces', 'Cut into 12 Pieces']
    },
    {
        id: 'p3',
        name: 'Premium Chicken Breast',
        price: 12.99,
        description: 'Boneless, skinless prime chicken breast fillets. Lean and tender.',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=800',
        cutOptions: ['Whole', 'Diced', 'Sliced in strips']
    },
    {
        id: 'p4',
        name: 'Boneless Chicken Thighs',
        price: 10.50,
        description: 'Rich and flavorful boneless, skinless chicken thighs. Great for grilling.',
        image: 'assets/chicken_thighs.png'
    },
    {
        id: 'p5',
        name: 'Fresh Chicken Wings',
        price: 8.99,
        description: 'Plump and juicy chicken wings. Ready for your favorite marinade.',
        image: 'assets/chicken_wings.png',
        cutOptions: ['Whole', 'Cut in half']
    },
    {
        id: 'p6',
        name: 'Chicken Drumsticks',
        price: 7.50,
        description: 'Meaty, tender drumsticks. A family favorite for any day of the week.',
        image: 'assets/chicken_drumsticks.png'
    }
];

// State
let cart = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartTrigger = document.getElementById('cartTrigger');
const cartCount = document.getElementById('cartCount');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const emptyCartMsg = document.getElementById('emptyCart');
const cartTotalVal = document.getElementById('cartTotalVal');
const checkoutBtn = document.getElementById('checkoutBtn');

const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutBtn = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');

// Menu Elements
const menuTrigger = document.getElementById('menuTrigger');
const menuOverlay = document.getElementById('menuOverlay');
const menuSidebar = document.getElementById('menuSidebar');
const closeMenuBtn = document.getElementById('closeMenu');
const menuLinks = document.querySelectorAll('.menu-link');

// Initialize
function init() {
    renderProducts();
    setupEventListeners();
    updateCartUI();
}

// Render product catalog
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" loading="lazy" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100%\\' height=\\'100%\\' viewBox=\\'0 0 100 100\\'><rect fill=\\'%231a1a1a\\' width=\\'100\\' height=\\'100\\'/><text fill=\\'%238b949e\\' x=\\'50\\' y=\\'50\\' font-family=\\'sans-serif\\' font-size=\\'10\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>Image Loading</text></svg>'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-desc">${product.description}</p>
                ${(product.skinOptions || product.cutOptions) ? `
                <div class="product-options">
                    ${product.skinOptions ? `
                        <label for="skin-${product.id}">Skin:</label>
                        <select id="skin-${product.id}" class="option-select">
                            ${product.skinOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    ` : ''}
                    
                    ${product.cutOptions ? `
                        <label for="cut-${product.id}" style="${product.skinOptions ? 'margin-top: 0.25rem;' : ''}">Cut:</label>
                        <select id="cut-${product.id}" class="option-select">
                            ${product.cutOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    ` : ''}
                </div>
                ` : ''}
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Event Listeners
function setupEventListeners() {
    // Open cart
    cartTrigger.addEventListener('click', () => {
        cartOverlay.classList.add('active');
        cartSidebar.classList.add('active');
    });

    // Close cart
    const closeCart = () => {
        cartOverlay.classList.remove('active');
        cartSidebar.classList.remove('active');
    };
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Open Checkout Modal
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        closeCart();

        // Auto-fill tomorrow's date as min date
        const dateInput = document.getElementById('deliveryDate');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];

        checkoutModal.classList.add('active');
    });

    // Close Checkout Modal
    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
    });

    // Form Submit (WhatsApp integration)
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitOrder();
    });

    // Navigation Sidebar Logic
    const navOverlay = document.getElementById('navOverlay');
    const navSidebar = document.getElementById('navSidebar');
    const sidebarTrigger = document.getElementById('sidebarTrigger');
    const closeNavBtn = document.getElementById('closeNav');

    sidebarTrigger.addEventListener('click', () => {
        navOverlay.classList.add('active');
        navSidebar.classList.add('active');
    });

    window.closeNavSidebar = function () {
        navOverlay.classList.remove('active');
        navSidebar.classList.remove('active');
    };

    closeNavBtn.addEventListener('click', closeNavSidebar);
    navOverlay.addEventListener('click', closeNavSidebar);
}

// Add Toast Container to body
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(productName) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-icon">✓</span>
        <span><strong>${productName}</strong> added to cart!</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 1.75 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400); // Wait for transition to finish
    }, 1750);
}

// Cart Functions
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let skinOption = '';
    const skinSelect = document.getElementById(`skin-${productId}`);
    if (skinSelect) {
        skinOption = skinSelect.value;
    }

    let cutOption = '';
    const cutSelect = document.getElementById(`cut-${productId}`);
    if (cutSelect) {
        cutOption = cutSelect.value;
    }

    let selectedOptionsText = '';
    if (skinOption && cutOption) {
        selectedOptionsText = `${skinOption}, ${cutOption}`;
    }

    const cartItemId = selectedOptionsText ? `${productId}-${skinOption}-${cutOption}` : productId;
    const displayName = selectedOptionsText ? `${product.name} (${selectedOptionsText})` : product.name;

    const existingItem = cart.find(item => item.cartItemId === cartItemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, cartItemId, displayName, quantity: 1, skinOption, cutOption });
    }

    // Quick micro-animation on cart trigger
    cartTrigger.style.transform = 'scale(1.1)';
    setTimeout(() => cartTrigger.style.transform = 'scale(1)', 200);

    showToast(displayName);
    updateCartUI();
};

window.updateQuantity = function (cartItemId, delta) {
    const item = cart.find(item => item.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.cartItemId !== cartItemId);
    }
    updateCartUI();
};

window.removeFromCart = function (cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    updateCartUI();
};

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update items list
    if (cart.length === 0) {
        emptyCartMsg.style.display = 'block';
        cartItemsContainer.querySelectorAll('.cart-item').forEach(el => el.remove());
        checkoutBtn.disabled = true;
    } else {
        emptyCartMsg.style.display = 'none';

        // Clear existing items except empty message
        cartItemsContainer.querySelectorAll('.cart-item').forEach(el => el.remove());

        // Insert new items
        const itemsHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.displayName}" class="cart-item-img" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100%\\' height=\\'100%\\' viewBox=\\'0 0 100 100\\'><rect fill=\\'%231a1a1a\\' width=\\'100\\' height=\\'100\\'/></svg>'">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.displayName}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="updateQuantity('${item.cartItemId}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.cartItemId}', 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart('${item.cartItemId}')">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        cartItemsContainer.insertAdjacentHTML('beforeend', itemsHTML);
        checkoutBtn.disabled = false;
    }

    // Update total
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalVal.textContent = `$${totalAmount.toFixed(2)}`;
}

// Checkout integration
function submitOrder() {
    const name = document.getElementById('customerName').value;
    const date = document.getElementById('deliveryDate').value;
    const time = document.getElementById('deliveryTime').value;
    const address = document.getElementById('deliveryAddress').value;

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

    let itemsText = cart.map(item => `- ${item.quantity}x ${item.displayName} ($${(item.price * item.quantity).toFixed(2)})`).join('\n');

    // Shop Owner's WhatsApp Number (Include country code, ex: 1234567890)
    const shopOwnerNumber = '6596499104'; // <-- Replace with the actual phone number

    // Format the message with clear sections
    const message = `*NEW ORDER* 
━━━━━━━━━━━━━━━━━━━━━━━

*CUSTOMER DETAILS*
• Name: ${name}

*DELIVERY INFORMATION*
• Date: ${date}
• Time: ${time}
• Address: ${address}

*ITEMS ORDERED*
${itemsText}

*TOTAL AMOUNT: $${totalAmount}*
━━━━━━━━━━━━━━━━━━━━━━━`;

    // Open WhatsApp directed to the owner's number
    const whatsappUrl = `https://wa.me/${shopOwnerNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Optional: Reset cart after placing order
    cart = [];
    updateCartUI();
    checkoutModal.classList.remove('active');
    checkoutForm.reset();
}

// Boot up
document.addEventListener('DOMContentLoaded', init);
