const API_BASE = window.ECOM_API_BASE || "http://localhost:8080";

async function registerUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");

    try {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, email, password}),
        });

        if (!response.ok) {
            throw new Error("Registration failed");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "products.html";
    } catch (err) {
        errorMsg.textContent = "Registration failed. Try a different email.";
    }
}

async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");

    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "products.html";
    } catch (err) {
        errorMsg.textContent = "Invalid email or password.";
    }
}

function logout() { localStorage.removeItem("token"); localStorage.removeItem("cart"); window.location.href = "login.html"; }
