import { products } from "./products.js";


const app = document.getElementById("app");
const cartCount = document.getElementById("cart-count");


let cart = JSON.parse(localStorage.getItem("shopeasy-cart")) || [];


/* =========================================
   CART FUNCTIONS
========================================= */

function saveCart() {

    localStorage.setItem(
        "shopeasy-cart",
        JSON.stringify(cart)
    );

}


function updateCartCount() {

    const totalItems = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);


    cartCount.textContent = totalItems;

    cartCount.setAttribute(
        "aria-label",
        `${totalItems} items in cart`
    );

}


function addToCart(productId) {

    const existingItem = cart.find(
        item => item.id === productId
    );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        const product = products.find(
            product => product.id === productId
        );


        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();
    updateCartCount();

    alert("Product added to cart!");

}


function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );


    saveCart();
    updateCartCount();

    renderCart();

}


function increaseQuantity(productId) {

    const item = cart.find(
        item => item.id === productId
    );


    if (item) {

        item.quantity++;

    }


    saveCart();
    updateCartCount();

    renderCart();

}


function decreaseQuantity(productId) {

    const item = cart.find(
        item => item.id === productId
    );


    if (!item) return;


    item.quantity--;


    if (item.quantity <= 0) {

        cart = cart.filter(
            item => item.id !== productId
        );

    }


    saveCart();
    updateCartCount();

    renderCart();

}


/* =========================================
   HOME PAGE
========================================= */

function renderHome() {

    app.innerHTML = `

        <section class="hero">

            <div class="container hero-content">

                <p class="eyebrow">
                    MODERN ONLINE SHOPPING
                </p>

                <h1>
                    Discover Products
                    <span>You Will Love</span>
                </h1>

                <p>
                    Explore our collection of modern products.
                    Shop easily, search quickly, and manage your cart
                    with a seamless client-side experience.
                </p>

                <a href="#/products" class="btn">
                    Explore Products
                </a>

            </div>

        </section>


        <section class="section">

            <div class="container">

                <h2>
                    Why ShopEasy?
                </h2>

                <div class="features-grid">

                    <article class="feature-card">

                        <div class="feature-icon">⚡</div>

                        <h3>
                            Fast Experience
                        </h3>

                        <p>
                            Client-side routing provides smooth navigation
                            without traditional page reloads.
                        </p>

                    </article>


                    <article class="feature-card">

                        <div class="feature-icon">🔍</div>

                        <h3>
                            Easy Search
                        </h3>

                        <p>
                            Quickly find products using our dynamic
                            search and filtering system.
                        </p>

                    </article>


                    <article class="feature-card">

                        <div class="feature-icon">🛒</div>

                        <h3>
                            Smart Cart
                        </h3>

                        <p>
                            Your shopping cart is saved automatically
                            using browser local storage.
                        </p>

                    </article>

                </div>

            </div>

        </section>

    `;

}


/* =========================================
   PRODUCT CARD
========================================= */

function createProductCard(product) {

    return `

        <article class="product-card">

            <div class="product-image" aria-hidden="true">
                ${product.emoji}
            </div>

            <div class="product-content">

                <span class="category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description}
                </p>

                <div class="product-footer">

                    <strong>
                        ₹${product.price.toLocaleString("en-IN")}
                    </strong>

                    <button
                        class="btn add-cart-btn"
                        data-product-id="${product.id}"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================
   PRODUCTS PAGE
========================================= */

function renderProducts() {

    app.innerHTML = `

        <section class="section">

            <div class="container">

                <div class="page-heading">

                    <h1>
                        Our Products
                    </h1>

                    <p>
                        Browse, search, and filter our product catalog.
                    </p>

                </div>


                <div class="product-controls">

                    <input
                        type="search"
                        id="search-input"
                        placeholder="Search products..."
                        aria-label="Search products"
                    >


                    <select
                        id="category-filter"
                        aria-label="Filter products by category"
                    >

                        <option value="All">
                            All Categories
                        </option>

                        <option value="Electronics">
                            Electronics
                        </option>

                        <option value="Fashion">
                            Fashion
                        </option>

                        <option value="Home">
                            Home
                        </option>

                    </select>

                </div>


                <p
                    id="product-result"
                    class="result-text"
                    aria-live="polite"
                >
                    Showing ${products.length} products
                </p>


                <div
                    id="products-grid"
                    class="products-grid"
                >
                    ${products.map(createProductCard).join("")}
                </div>

            </div>

        </section>

    `;


    const searchInput =
        document.getElementById("search-input");


    const categoryFilter =
        document.getElementById("category-filter");


    function filterProducts() {

        const searchText =
            searchInput.value.toLowerCase();


        const selectedCategory =
            categoryFilter.value;


        const filteredProducts = products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;


            return matchesSearch && matchesCategory;

        });


        document.getElementById("products-grid").innerHTML =
            filteredProducts.length > 0
                ? filteredProducts.map(createProductCard).join("")
                : `
                    <p class="empty-message">
                        No products found.
                    </p>
                `;


        document.getElementById("product-result").textContent =
            `Showing ${filteredProducts.length} product(s)`;

    }


    searchInput.addEventListener(
        "input",
        filterProducts
    );


    categoryFilter.addEventListener(
        "change",
        filterProducts
    );


    document
        .getElementById("products-grid")
        .addEventListener("click", event => {

            if (
                event.target.classList.contains("add-cart-btn")
            ) {

                const productId = Number(
                    event.target.dataset.productId
                );


                addToCart(productId);

            }

        });

}


/* =========================================
   ABOUT PAGE
========================================= */

function renderAbout() {

    app.innerHTML = `

        <section class="section">

            <div class="container about-page">

                <h1>
                    About ShopEasy
                </h1>

                <p>
                    ShopEasy is a modern e-commerce product catalog
                    created as a Full-Stack Deployment and Project
                    Architecture Capstone Project.
                </p>


                <div class="about-grid">

                    <article class="info-card">

                        <h2>
                            Modular Architecture
                        </h2>

                        <p>
                            The application separates product data and
                            application logic into different JavaScript
                            modules for better organization.
                        </p>

                    </article>


                    <article class="info-card">

                        <h2>
                            Client-Side Routing
                        </h2>

                        <p>
                            Navigation is handled using JavaScript and
                            URL hash routes without loading separate
                            HTML pages.
                        </p>

                    </article>


                    <article class="info-card">

                        <h2>
                            Local Storage
                        </h2>

                        <p>
                            Cart information is saved locally so that
                            the user's data remains available after
                            refreshing the browser.
                        </p>

                    </article>

                </div>

            </div>

        </section>

    `;

}


/* =========================================
   CART PAGE
========================================= */

function renderCart() {

    if (cart.length === 0) {

        app.innerHTML = `

            <section class="section">

                <div class="container">

                    <div class="empty-cart">

                        <h1>
                            Your Cart is Empty
                        </h1>

                        <p>
                            Add some products to start shopping.
                        </p>

                        <a
                            href="#/products"
                            class="btn"
                        >
                            View Products
                        </a>

                    </div>

                </div>

            </section>

        `;

        return;

    }


    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );


    app.innerHTML = `

        <section class="section">

            <div class="container">

                <div class="page-heading">

                    <h1>
                        Shopping Cart
                    </h1>

                    <p>
                        Review and manage your selected products.
                    </p>

                </div>


                <div class="cart-list">

                    ${cart.map(item => `

                        <article class="cart-item">

                            <div
                                class="cart-product-icon"
                                aria-hidden="true"
                            >
                                ${item.emoji}
                            </div>


                            <div class="cart-item-info">

                                <h2>
                                    ${item.name}
                                </h2>

                                <p>
                                    ₹${item.price.toLocaleString("en-IN")}
                                </p>

                            </div>


                            <div class="quantity-controls">

                                <button
                                    class="quantity-btn"
                                    data-action="decrease"
                                    data-product-id="${item.id}"
                                    aria-label="Decrease quantity of ${item.name}"
                                >
                                    −
                                </button>


                                <span>
                                    ${item.quantity}
                                </span>


                                <button
                                    class="quantity-btn"
                                    data-action="increase"
                                    data-product-id="${item.id}"
                                    aria-label="Increase quantity of ${item.name}"
                                >
                                    +
                                </button>

                            </div>


                            <strong class="item-total">

                                ₹${(
                                    item.price * item.quantity
                                ).toLocaleString("en-IN")}

                            </strong>


                            <button
                                class="remove-btn"
                                data-action="remove"
                                data-product-id="${item.id}"
                                aria-label="Remove ${item.name} from cart"
                            >
                                Remove
                            </button>

                        </article>

                    `).join("")}

                </div>


                <div class="cart-summary">

                    <h2>
                        Total: ₹${total.toLocaleString("en-IN")}
                    </h2>

                    <button
                        id="checkout-btn"
                        class="btn"
                    >
                        Proceed to Checkout
                    </button>

                </div>

            </div>

        </section>

    `;


    document
        .querySelector(".cart-list")
        .addEventListener("click", event => {

            const button = event.target.closest("button");

            if (!button) return;


            const productId = Number(
                button.dataset.productId
            );


            const action = button.dataset.action;


            if (action === "increase") {

                increaseQuantity(productId);

            }


            if (action === "decrease") {

                decreaseQuantity(productId);

            }


            if (action === "remove") {

                removeFromCart(productId);

            }

        });


    document
        .getElementById("checkout-btn")
        .addEventListener("click", () => {

            alert(
                "Demo checkout successful! Thank you for shopping."
            );

        });

}


/* =========================================
   CLIENT-SIDE ROUTER
========================================= */

function router() {

    const route =
        window.location.hash || "#/";


    switch (route) {

        case "#/":
            renderHome();
            break;


        case "#/products":
            renderProducts();
            break;


        case "#/about":
            renderAbout();
            break;


        case "#/cart":
            renderCart();
            break;


        default:
            app.innerHTML = `

                <section class="section">

                    <div class="container empty-cart">

                        <h1>
                            404 - Page Not Found
                        </h1>

                        <p>
                            The page you are looking for does not exist.
                        </p>

                        <a
                            href="#/"
                            class="btn"
                        >
                            Go Home
                        </a>

                    </div>

                </section>

            `;

    }

}


/* =========================================
   INITIALIZATION
========================================= */

window.addEventListener(
    "hashchange",
    router
);


updateCartCount();

router();