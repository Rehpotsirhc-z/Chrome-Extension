// GLOBAL VARIABLES
const ages = ["ages-3-to-5", "ages-6-to-12", "ages-13-to-18", "custom"];
const blockingCategories = [
    "profanity",
    "web-based-games",
    "social-media-and-forums",
    "monetary-transactions",
    "explicit-content",
    "drugs",
    "gambling",
];
const customCheckboxes = blockingCategories.map((c) => `${c}-checkbox`);

// PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
    // CHECK AUTHENTICATION
    const authenticated = localStorage.getItem("authenticated") === "true";
    if (!authenticated) window.location.href = "barrier.html";

    // VARIABLES
    const [
        logoutButton,
        changePasswordButton,
        changePasswordPrompt,
        submitPasswordButton,
        oldPasswordField,
        newPasswordField,
        newPasswordConfirmationField,
    ] = [
        "logout-button",
        "change-password-button",
        "change-password-prompt",
        "change-password-submit-button",
        "old-password-field",
        "new-password-field",
        "confirm-new-password-field",
    ].map((id) => document.getElementById(id));

    // Make checkboxes change localStorage values
    customCheckboxes.forEach((checkbox) => {
        document.getElementById(checkbox).addEventListener("click", (event) => {
            toggleRestriction(event.target.value);
        });
    });

    // TABLINKS SIDE BAR
    // Make tablinks open the corresponding tabcontent
    document.querySelectorAll(".tablink").forEach((tabLink) => {
        tabLink.addEventListener("click", (event) => {
            const href = tabLink.dataset.href;
            openTab(event, href.substring(1));
        });
    });

    // Open first tab by default
    document.querySelector(".tablink")?.click();

    // EXPANDED PRESETS
    // Observe the expanded presets to resize them when the window is resized
    observePresetResize();

    // Make expand buttons expand the corresponding section
    ages.forEach((age) =>
        document
            .getElementById(`${age}-expand-button`)
            .addEventListener("click", (e) => toggleExpandButton(e, age)),
    );

    // Make clicking on blank areas of expanded Custom preset toggle checkboxes
    document.querySelectorAll(".blocking-checkbox").forEach((div) =>
        div.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent clicks from propagating to parent elements
            checkbox = event.currentTarget.querySelector(
                'input[type="checkbox"]',
            ).checked ^= true;
        }),
    );

    // PRESET RADIO BUTTONS
    ages.forEach((age) => {
        const radioButton = document.getElementById(`${age}-radio`);
        const preset = document.getElementById(`${age}-preset`);

        // Check radio button based on saved value
        if (localStorage.getItem(age) === "true") radioButton.checked = true;

        // Save the selected preset to localStorage on radio button selection
        radioButton.addEventListener("change", (event) => {
            if (event.target.checked) {
                clearRadioButtons();
                applyRestrictions(age);
                localStorage.setItem(age, "true");
            }
        });

        // Make clicking on the preset select the corresponding radio button
        preset.addEventListener("click", () => {
            const target = document.getElementById(`${age}-radio`);
            if (target) target.checked = true;
            radioButton.dispatchEvent(new Event("change")); // Trigger change event (defined above)
        });
    });

    // LOGOUT & CHANGE PASSWORD
    // Make logout button log the user out
    logoutButton.addEventListener("click", () => {
        if (localStorage.getItem("authenticated") === "true") {
            localStorage.setItem("authenticated", "false");
            window.location.href = "barrier.html";
        }
    });

    // Show the change password prompt when the button is clicked
    changePasswordButton.addEventListener("click", () => {
        changePasswordPrompt.classList.add("active");
        oldPasswordField.focus();
    });

    // CHANGE PASSWORD PROMPT
    submitPasswordButton.addEventListener("click", submitPassword);

    // TODO Close prompt when clicking out of the prompt
    // Close the prompt when pressing Escape
    // We use addEventListener instead of onkeydown to preserve default
    // keybindings
    document.addEventListener("keydown", (e) => {
        e.key === "Escape" && changePasswordPrompt.classList.remove("active");
    });

    // Submit password when pressing Enter
    newPasswordConfirmationField.addEventListener("keydown", (e) => {
        e.key === "Enter" && submitPassword();
    });

    // TODO STATISTICS LOGIC
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
        type: "pie",
        date: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [
                {
                    label: "# of Votes",
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)", // Red
                        "rgba(54, 162, 235, 0.2)", // Blue
                        "rgba(255, 206, 86, 0.2)", // Yellow
                        "rgba(75, 192, 192, 0.2)", // Green
                        "rgba(153, 102, 255, 0.2)", // Purple
                        "rgba(255, 159, 64, 0.2)", // Orange
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)", // Red
                        "rgba(54, 162, 235, 1)", // Blue
                        "rgba(255, 206, 86, 1)", // Yellow
                        "rgba(75, 192, 192, 1)", // Green
                        "rgba(153, 102, 255, 1)", // Purple
                        "rgba(255, 159, 64, 1)", // Orange
                    ],
                    borderWidth: 1,
                },
            ],
        },
    });
});

// FUNCTIONS
// Resize the expanded presets when the window is resized
function observePresetResize() {
    document.querySelectorAll(".blocking-preset").forEach((preset) => {
        const targetId = preset.dataset.target.replace("-radio", "-expanded");
        const expanded = document.getElementById(targetId);

        if (expanded) {
            new ResizeObserver(() => {
                expanded.style.width = `${preset.offsetWidth}px`;
            }).observe(preset);
        }
    });
}

// Open the tab with the given name and close all others
function openTab(event, tabName) {
    const tabContent = document.querySelectorAll(".tabcontent");
    const tabLinks = document.querySelectorAll(".tablink");

    tabContent.forEach((content) => (content.style.display = "none"));
    tabLinks.forEach((link) => link.classList.remove("active"));

    document.getElementById(tabName).style.display = "block";
    event.currentTarget.classList.add("active");
}

// Toggle the value of a restriction in localStorage
function toggleRestriction(value) {
    const isChecked = localStorage.getItem(value) === "true";
    localStorage.setItem(value, !isChecked); // Toggle value (it will automatically convert to string)
}

// Save restrictions based on the selected preset and update checkboxes to match
function applyRestrictions(id) {
    const restrictions = {
        "ages-3-to-5": [
            "profanity",
            "web-based-games",
            "social-media-and-forums",
            "monetary-transactions",
            "explicit-content",
            "drugs",
            "gambling",
        ],
        "ages-6-to-12": [
            "profanity",
            "social-media-and-forums",
            "monetary-transactions",
            "explicit-content",
            "drugs",
            "gambling",
        ],
        "ages-13-to-18": ["explicit-content", "drugs", "gambling"],
    };

    const presetRestrictions = restrictions[id];

    if (presetRestrictions) {
        clearRestrictions();
        presetRestrictions.forEach((restriction) =>
            localStorage.setItem(restriction, "true"),
        );
    }
    // Otherwise assumed to be custom

    setCheckboxes();
}

// Clear all restrictions in localStorage
function clearRestrictions() {
    blockingCategories.forEach((restriction) =>
        localStorage.setItem(restriction, "false"),
    );
}

// Expand or collapse the section corresponding to the clicked button
function toggleExpandButton(event, age) {
    const preset = document.getElementById(`${age}-preset`);
    var section = document.getElementById(`${age}-expanded`);

    // We need to set the max-height manually to remove the lag when closing the
    // expanded preset
    if (section.classList.contains("expanded")) {
        section.classList.remove("expanded");
        section.style.maxHeight = "0px";
    } else {
        section.classList.add("expanded");
        section.style.maxHeight = section.scrollHeight + 20 + "px";
        // section.scrollHeight + preset.offsetWidth + "px";
    }
}

// Clear all preset selections in localStorage
function clearRadioButtons() {
    ages.forEach((radioButton) => {
        localStorage.setItem(radioButton, "false");
    });
}

// Set checkboxes to match localStorage values
function setCheckboxes() {
    blockingCategories.forEach((age) => {
        const isChecked = localStorage.getItem(age) === "true";
        document.getElementById(`${age}-checkbox`).checked = isChecked;
    });
}

// Set the new password
function submitPassword() {
    const [oldPassword, newPassword, newPasswordConfirmation] = [
        "old-password-field",
        "new-password-field",
        "confirm-new-password-field",
    ].map((id) => document.getElementById(id).value);

    const storedPassword = localStorage.getItem("password");

    if (oldPassword !== localStorage.getItem("password"))
        return alert("Incorrect password. Please try again.");

    if (!newPassword)
        return alert("New password cannot be empty. Please try again.");

    if (newPassword !== newPasswordConfirmation)
        return alert("New passwords do not match. Please try again.");

    localStorage.setItem("password", newPassword);
    localStorage.setItem("authenticated", "false");
    window.location.href = "barrier.html";
}
