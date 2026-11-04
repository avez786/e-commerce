const API_BASE = window.ECOM_API_BASE || "http://localhost:8080";
function escapeHtml(value) { return String(value ?? "").replace(/[&<>\"']/g, function(c) { return {"&":"&amp;","<":"&lt;",">":"&gt;", "\"":"&quot;", "'":"&#39;"}[c]; }); }
function getToken() {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "login.html";
    return token;
}
function logout() { localStorage.removeItem("token"); localStorage.removeItem("cart"); window.location.href = "login.html"; }
async function loadOrders() {
    const token = getToken();
    const errorMsg = document.getElementById("errorMsg");
    const ordersList = document.getElementById("ordersList");
    try {
        const response = await fetch(`${API_BASE}/api/orders/my`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error("Failed to load orders");
        const orders = await response.json();
        if (!Array.isArray(orders) || orders.length === 0) { ordersList.innerHTML = "<p>You haven't placed any orders yet.</p>"; return; }
        ordersList.innerHTML = orders.map(order => `
            <article class="order-card">
                <div class="order-header"><span class="order-id">Order #${Number(order.id)}</span><span class="order-status status-${escapeHtml(order.status)}">${escapeHtml(order.status)}</span></div>
                ${(order.items || []).map(item => `<div class="order-item-row"><span>${escapeHtml(item.productName)} x ${Number(item.quantity)}</span><span>₹${(Number(item.priceAtPurchase) * Number(item.quantity)).toFixed(2)}</span></div>`).join("")}
                <div class="order-total">Total: ₹${Number(order.totalAmount).toFixed(2)}</div>
                <div class="order-date">Placed on: ${new Date(order.createdAt).toLocaleString()}</div>
            </article>`).join("");
    } catch (err) { errorMsg.textContent = "Could not load orders. Please try again."; }
}
loadOrders();
