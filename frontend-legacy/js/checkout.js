const API_BASE = window.ECOM_API_BASE || "http://localhost:8080";
function escapeHtml(value) { return String(value ?? "").replace(/[&<>\"']/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;", "\"":"&quot;", "'":"&#39;"}[c]; }); }

function getToken() {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "login.html";
    return token;
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

function getCart() {
    try { const cart = JSON.parse(localStorage.getItem("cart") || "[]"); return Array.isArray(cart) ? cart : []; }
    catch { return []; }
}

function renderSummary() {
    const cart = getCart();
    const summary = document.getElementById("orderSummary");

    if (cart.length === 0) {
        summary.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    const itemsHtml = cart
        .map(
            (item) => `
        <div class="summary-item">
            <span>${escapeHtml(item.name)} x ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `,
        )
        .join("");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    summary.innerHTML = `
        <h3>Order Summary</h3>
        ${itemsHtml}
        <div class="summary-total">
            <span>Total</span>
            <span>₹${total.toFixed(2)}</span>
        </div>
    `;

    document.getElementById("payButton").textContent = `Pay ₹${total.toFixed(2)}`;
}

async function processPayment() {
    const token = getToken();
    const errorMsg = document.getElementById("errorMsg");
    const payButton = document.getElementById("payButton");
    const cart = getCart();

    if (cart.length === 0) {
        errorMsg.textContent = "Your cart is empty.";
        return;
    }

    payButton.disabled = true;
    payButton.textContent = "Processing payment...";
    errorMsg.textContent = "";

    // Demo checkout only: no real payment provider is integrated.
    // Keep this deterministic for repeatable project demonstrations.

    // Payment "succeeded" - now actually place the real order
    try {
        const orderRequest = {
            items: cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        };

        const response = await fetch(`${API_BASE}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderRequest),
        });

        if (!response.ok) throw new Error("Order creation failed");

        localStorage.removeItem("cart");
        alert("Demo checkout complete. Order placed (no real payment was processed).");
        window.location.href = "orders.html";
    } catch (err) {
        errorMsg.textContent = "Order placement failed. Your cart has been kept; please try again.";
        payButton.disabled = false;
        renderSummary();
    }
}

renderSummary();
