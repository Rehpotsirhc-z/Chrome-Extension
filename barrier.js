document.addEventListener("DOMContentLoaded", function () {
    const passwordSection = document.getElementById("password-section");
    const setPasswordSection = document.getElementById("set-password-section");

    const setPasswordButton = document.getElementById("set-password-button");
    const confirmPasswordInput = document.getElementById("confirm-password-field");

    const submitPasswordButton = document.getElementById("submit-password-button");
    const passwordInputField = document.getElementById("password-field");

    // Check if there is a stored password in local
    if (localStorage.getItem("password")) {
        passwordSection.style.display = "flex";
        setPasswordSection.style.display = "none";
    } else {
        passwordSection.style.display = "none";
        setPasswordSection.style.display = "flex";
    }

    setPasswordButton.addEventListener("click", setPassword);
    confirmPasswordInput.onkeydown = function (e) {
        if (e.key === "Enter") {
            setPassword();
        }
    };

    submitPasswordButton.addEventListener("click", submitPassword);
    passwordInputField.onkeydown = function (e) {
        if (e.key === "Enter") {
            submitPassword();
        }
    };
});



function setPassword() {
    const setPasswordInput = document.getElementById("set-password-field");
    const password = setPasswordInput.value;
    const confirmPasswordInput = document.getElementById("confirm-password-field");
    const confirmPassword = confirmPasswordInput.value;
    const passwordSection = document.getElementById("password-section");
    const setPasswordSection = document.getElementById("set-password-section");

    if (password && password === confirmPassword) {
        localStorage.setItem("password", password);
        passwordSection.style.display = "flex";
        setPasswordSection.style.display = "none";
    } else {
        alert(password ? "Passwords do not match" : "Password cannot be empty");
    }
}

function submitPassword() {
    const passwordInput = document.getElementById("password-field");

    const password = localStorage.getItem("password");

    const attemptedPassword = passwordInput.value;

    if (password === attemptedPassword) {
        localStorage.setItem("authenticated", true);

        // wait for 1 second before redirecting
        // setTimeout(() => {
        //   window.location.href = "settings.html";
        // }, 1000);
        window.location.href = "settings.html";
    } else {
        // show the incorrect password message
        const incorrectPasswordMessage = document.getElementById("incorrect-password-message");
        incorrectPasswordMessage.style.display = "block";
    }
}