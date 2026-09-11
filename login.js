const form = document.getElementById("login-form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const message = document.getElementById("form-message");
const togglePassword = document.getElementById("toggle-password");
const forgotPassword = document.getElementById("forgot-password");

const SESSION_KEY = "labelguard_demo_session";

const setError = (element, text) => {
    if (element) element.textContent = text;
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// If the user is already signed in to the local demo session, don't show the login form again.
if (localStorage.getItem(SESSION_KEY) === "active") {
    window.location.replace("index.html");
}

email?.addEventListener("input", () => setError(emailError, ""));
password?.addEventListener("input", () => setError(passwordError, ""));

togglePassword?.addEventListener("click", () => {
    const visible = password.type === "text";
    password.type = visible ? "password" : "text";
    togglePassword.textContent = visible ? "Show" : "Hide";
    togglePassword.setAttribute("aria-label", visible ? "Show password" : "Hide password");
});

forgotPassword?.addEventListener("click", (event) => {
    event.preventDefault();
    if (message) message.textContent = "Password recovery will be enabled when a production authentication provider is connected.";
});

form?.addEventListener("submit", (event) => {
    event.preventDefault();
    setError(emailError, "");
    setError(passwordError, "");
    if (message) message.textContent = "";

    const emailValue = email.value.trim();
    const passwordValue = password.value;
    let valid = true;

    if (!isValidEmail(emailValue)) {
        setError(emailError, "Enter a valid email address.");
        valid = false;
    }

    if (passwordValue.length < 8) {
        setError(passwordError, "Password must contain at least 8 characters.");
        valid = false;
    }

    if (!valid) return;

    // Demo-only session. This is NOT authentication and must be replaced by a real provider.
    localStorage.setItem(SESSION_KEY, "active");
    localStorage.setItem("labelguard_demo_user", emailValue);

    if (message) message.textContent = "Sign-in successful. Opening your workspace…";

    window.setTimeout(() => {
        window.location.replace("index.html");
    }, 350);
});
