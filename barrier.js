// PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
    // VARIABLES
    const [passwordInputField, submitPasswordButton] = [
        "password-field",
        "submit-password-button",
    ].map((id) => document.getElementById(id));

    const [
        setPasswordInputField,
        confirmPasswordInputField,
        setPasswordButton,
    ] = [
        "set-password-field",
        "confirm-password-field",
        "set-password-button",
    ].map((id) => document.getElementById(id));

    // PASSWORD AUTHENTICATION
    if (localStorage.getItem("password")) {
        showSection("password");
        passwordInputField.focus();
    } else {
        showSection("setPassword");
        setPasswordInputField.focus();
    }

    // PASSWORD MANAGEMENT
    // Submit password when button is clicked or Enter is pressed
    // We use addEventListener instead of onkeydown to preserve default
    // keybindings
    submitPasswordButton.addEventListener("click", submitPassword);
    passwordInputField.addEventListener("keydown", (e) => {
        e.key === "Enter" && submitPassword();
    });

    // Set password when button is clicked or Enter is pressed
    // We use addEventListener instead of onkeydown to preserve default
    // keybindings
    setPasswordButton.addEventListener("click", setPassword);
    confirmPasswordInputField.addEventListener("keydown", (e) => {
        e.key === "Enter" && setPassword();
    });
});

// FUNCTIONS
// Submit the password
function submitPassword() {
    const password = localStorage.getItem("password");
    const attemptedPassword = document.getElementById("password-field").value;

    if (password === attemptedPassword) {
        localStorage.setItem("authenticated", "true");
        window.location.href = "settings.html";
    } else {
        document
            .getElementById("incorrect-password-message")
            .classList.add("active");
    }
}

// Set the new password
function setPassword() {
    const password = document.getElementById("set-password-field").value;
    const confirmPassword = document.getElementById(
        "confirm-password-field",
    ).value;

    if (password && password === confirmPassword) {
        localStorage.setItem("password", password);
        showSection("password");
    } else {
        alert(password ? "Passwords do not match" : "Password cannot be empty");
    }
}

// Show the specified section
function showSection(sectionToShow) {
    const passwordSection = document.getElementById("password-section");
    const setPasswordSection = document.getElementById("set-password-section");

    if (sectionToShow === "password") {
        passwordSection.classList.add("active");
        setPasswordSection.classList.remove("active");
    } else if (sectionToShow === "setPassword") {
        passwordSection.classList.remove("active");
        setPasswordSection.classList.add("active");
    } else {
        console.error("Invalid section specified.");
    }
}
