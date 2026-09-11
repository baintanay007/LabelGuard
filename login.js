const form = document.getElementById("login-form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const message = document.getElementById("form-message");
const togglePassword = document.getElementById("toggle-password");
const forgotPassword = document.getElementById("forgot-password");

const setError = (element, text) => {
    element.textContent = text;
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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
    message.textContent = "Password recovery will be enabled when the production authentication provider is connected.";
});

form?.addEventListener("submit", (event) => {
    event.preventDefault();
    setError(emailError, "");
    setError(passwordError, "");
    message.textContent = "";

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

    message.textContent = "The form is valid. Production sign-in requires a real authentication provider.";
});
