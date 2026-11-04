let currentProduct = null;
function escapeHtml(value) { return String(value ?? "").replace(/[&<>\"']/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;", "\"":"&quot;", "'":"&#39;"}[c]; }); }
function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function loadProductDetail() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const productId = getIdFromUrl();
    const container = document.getElementById("productDetail");
    const errorMsg = document.getElementById("errorMsg");

    if (!productId) {
        errorMsg.textContent = "No product specified.";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/products/${productId}`, {
            headers: {Authorization: `Bearer ${token}`},
        });

        if (!response.ok) throw new Error("Failed to load product");

        const product = await response.json();
        currentProduct = product;

        container.innerHTML = `
            <div class="detail-card">
                <img src="${escapeHtml(product.imageUrl || "https://placehold.co/600x600?text=Product")}" alt="${escapeHtml(product.name)}" class="detail-image">
                <div class="detail-info">
                    <div class="detail-category">${escapeHtml(product.category || "")}</div>
                    <h2>${escapeHtml(product.name)}</h2>
                    <p class="detail-description">${escapeHtml(product.description || "No description available.")}</p>
                    <div class="detail-price">₹${product.price}</div>
                    <div class="detail-stock">In stock: ${product.stockQuantity}</div>
                    <input type="number" min="1" max="${product.stockQuantity}" value="1" id="qty-${product.id}">
                    <button onclick="addToOrderFromDetail(${product.id})">Add to Order</button>
                </div>
            </div>
        `;
    } catch (err) {
        errorMsg.textContent = "Could not load product details.";
    }
}

function addToOrderFromDetail(productId) {
    if (!currentProduct || Number(currentProduct.id) !== Number(productId)) return;
    const quantity = Number.parseInt(document.getElementById(`qty-${productId}`)?.value, 10);
    const errorMsg = document.getElementById("errorMsg");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > Number(currentProduct.stockQuantity)) {
        errorMsg.textContent = `Enter a quantity between 1 and ${currentProduct.stockQuantity}.`; return;
    }
    let cart;
    try { cart = JSON.parse(localStorage.getItem("cart") || "[]"); if (!Array.isArray(cart)) cart = []; } catch { cart = []; }
    const existing = cart.find(item => Number(item.productId) === Number(productId));
    const nextQuantity = (existing?.quantity || 0) + quantity;
    if (nextQuantity > Number(currentProduct.stockQuantity)) { errorMsg.textContent = `Only ${currentProduct.stockQuantity} item(s) are in stock.`; return; }
    if (existing) existing.quantity = nextQuantity;
    else cart.push({productId: currentProduct.id, name: currentProduct.name, price: Number(currentProduct.price), quantity});
    localStorage.setItem("cart", JSON.stringify(cart));
    errorMsg.textContent = "Added to cart. Review it on the Products page.";
}

loadProductDetail();
