document.addEventListener('DOMContentLoaded', function() {
    const passwordSection = document.getElementById('password-section');
    const setPasswordSection = document.getElementById('set-password-section');

    const passwordInput = document.getElementById('password-field');

    const setPasswordInput = document.getElementById('set-password-field');
    const confirmPasswordInput = document.getElementById('confirm-password-field');
    const setPasswordButton = document.getElementById('set-password-button');

    const submitPasswordButton = document.getElementById('submit-password-button');

    // Check if there is a stored password in local
    if (localStorage.getItem('password')) {
        passwordSection.style.display = "flex";
        setPasswordSection.style.display = "none";
    } else {
        passwordSection.style.display = "none";
        setPasswordSection.style.display = "flex";
    }

    setPasswordButton.addEventListener('click', function() {
        const password = setPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password === confirmPassword && password !== "") {
            localStorage.setItem('password', password);
            passwordSection.style.display = "flex";
            setPasswordSection.style.display = "none";
        }
    });

    submitPasswordButton.addEventListener('click', function() {
        const password = localStorage.getItem('password');
        const attemptedPassword = passwordInput.value;

        if (password === attemptedPassword) {
            localStorage.setItem('authenticated', true);
            console.log(localStorage.getItem("authenticated"));
            // wait for 1 second before redirecting
            setTimeout(() => {
                window.location.href = "settings.html";
            }, 1000);
        }
    });
});