const DEFAULT_API_BASE = "http://127.0.0.1:8000/api";
const TOKEN_KEY = "php_auth_kit_token";
const API_BASE_KEY = "php_auth_kit_api_base";

const $ = (selector) => document.querySelector(selector);

function getApiBase() {
    return (localStorage.getItem(API_BASE_KEY) || DEFAULT_API_BASE).replace(/\/+$/, "");
}

function setApiBase(value) {
    const normalized = value.trim().replace(/\/+$/, "");
    localStorage.setItem(API_BASE_KEY, normalized || DEFAULT_API_BASE);
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

function showStatus(message, type = "error") {
    const node = $("#status");

    if (!node) {
        return;
    }

    node.textContent = message;
    node.className = `status ${type} is-visible`;
}

function setBusy(form, busy) {
    if (!form) {
        return;
    }

    form.querySelectorAll("button, input").forEach((element) => {
        element.disabled = busy;
    });
}

function extractError(data, fallback) {
    if (data?.errors) {
        return Object.values(data.errors).flat().join(" ");
    }

    return data?.message || fallback;
}

async function request(path, options = {}) {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };
    const token = getToken();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${getApiBase()}${path}`, {
        ...options,
        headers,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error(extractError(data, "The request failed."));
    }

    return data;
}

function initApiInput() {
    const input = $("#apiBase");

    if (!input) {
        return;
    }

    input.value = getApiBase();
    input.addEventListener("change", () => setApiBase(input.value));
}

function redirectIfAuthenticated() {
    if (getToken()) {
        window.location.href = "dashboard.html";
    }
}

function requireToken() {
    if (!getToken()) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

function initLogin() {
    initApiInput();
    redirectIfAuthenticated();

    const form = $("#loginForm");

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        setApiBase($("#apiBase").value);
        setBusy(form, true);

        try {
            const data = await request("/login", {
                method: "POST",
                body: JSON.stringify({
                    email: $("#email").value,
                    password: $("#password").value,
                }),
            });

            setToken(data.token);
            showStatus("Signed in. Opening your dashboard.", "success");
            window.location.href = "dashboard.html";
        } catch (error) {
            showStatus(error.message);
        } finally {
            setBusy(form, false);
        }
    });
}

function initRegister() {
    initApiInput();
    redirectIfAuthenticated();

    const form = $("#registerForm");

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        setApiBase($("#apiBase").value);
        setBusy(form, true);

        try {
            const data = await request("/register", {
                method: "POST",
                body: JSON.stringify({
                    name: $("#name").value,
                    email: $("#email").value,
                    password: $("#password").value,
                }),
            });

            setToken(data.token);
            showStatus("Account created. Opening your dashboard.", "success");
            window.location.href = "dashboard.html";
        } catch (error) {
            showStatus(error.message);
        } finally {
            setBusy(form, false);
        }
    });
}

async function initDashboard() {
    initApiInput();

    if (!requireToken()) {
        return;
    }

    $("#tokenValue").textContent = getToken();

    try {
        const user = await request("/me");

        $("#userName").textContent = user.name || "Authenticated user";
        $("#profileName").textContent = user.name || "-";
        $("#profileEmail").textContent = user.email || "-";
        $("#profileId").textContent = user.id || "-";
        showStatus("Session loaded from the API.", "success");
    } catch (error) {
        clearToken();
        showStatus(`${error.message} Please sign in again.`);
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
    }

    $("#logoutButton")?.addEventListener("click", async () => {
        try {
            await request("/logout", { method: "POST" });
        } catch {
            // Local sign-out should still succeed if the token has already expired.
        } finally {
            clearToken();
            window.location.href = "login.html";
        }
    });

    $("#copyTokenButton")?.addEventListener("click", async () => {
        await navigator.clipboard.writeText(getToken() || "");
        showStatus("Token copied.", "success");
    });
}
