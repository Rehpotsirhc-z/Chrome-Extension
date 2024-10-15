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

    chrome.storage.local.get(["authenticated"]).then((result) => {
        if (!result.authenticated) window.location.href = "barrier.html";
    });

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

    // Make checkboxes change storage values
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
        chrome.storage.local.get([age]).then((result) => {
            if (result[age] === true) radioButton.checked = true;
        });

        // Save the selected preset to storage on radio button selection
        radioButton.addEventListener("change", (event) => {
            if (event.target.checked) {
                clearRadioButtons();
                applyRestrictions(age);
                chrome.storage.local.set({ [age]: true });
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
        chrome.storage.local.get(["authenticated"]).then((result) => {
            if (result.authenticated) {
                chrome.storage.local.set({ authenticated: false });
                window.location.href = "barrier.html";
            }
        });
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

    const categories = {
        profanity: "profanity",
        social: "social-media-and-forums",
        monetary: "monetary-transactions",
        explicit: "explicit-content",
        drugs: "drugs",
        games: "web-based-games",
        gambling: "gambling",
    };

    const categoryLog = {};

    Promise.all(
        Object.entries(categories).map(([key, value]) => {
            return chrome.storage.local.get([value]).then((result) => {
                categoryLog[key] = result[value];
            });
        }),
    ).then(() => {
        console.log(Object.keys(categoryLog));
        console.log(Object.values(categoryLog));
        // TODO STATISTICS LOGIC
        const ctx = document
            .getElementById("time-per-category")
            .getContext("2d");
        const myChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(categoryLog),
                datasets: [
                    {
                        label: "Time Spent on Category",
                        data: Object.values(categoryLog).map(
                            (value) => value.length,
                        ),
                        backgroundColor: [
                            "rgba(255, 99, 132, 1)", // Red
                            "rgba(54, 162, 235, 1)", // Blue
                            "rgba(255, 206, 86, 1)", // Yellow
                            "rgba(75, 192, 192, 1)", // Green
                            "rgba(153, 102, 255, 1)", // Purple
                            "rgba(255, 159, 64, 1)", // Orange
                            "rgba(25, 159, 64, 1)", // Orange
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)", // Red
                            "rgba(54, 162, 235, 1)", // Blue
                            "rgba(255, 206, 86, 1)", // Yellow
                            "rgba(75, 192, 192, 1)", // Green
                            "rgba(153, 102, 255, 1)", // Purple
                            "rgba(255, 159, 64, 1)", // Orange
                            "rgba(25, 159, 64, 1)", // Orange
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                responsive: false,
            },
        });
    });

    const eventLog = [];

    function isWithin5Minutes(timestamp, targetTimestamp) {
        let time = new Date(timestamp);
        let endTime = new Date(time.getTime() + 5 * 60000).getTime();
        return endTime >= targetTimestamp;
    }

    Promise.all(
        [...Object.entries(categories), ["background", "background"]].map(
            ([key, value]) => {
                return chrome.storage.local.get([value]).then((result) => {
                    // TODO: Figure out the problem
                    try {
                        eventLog.push(...result[value]);
                    } catch (e) {
                        console.log(e);
                    }
                });
            },
        ),
    ).then(() => {
        console.log(eventLog);
        function generateTimeLabels() {
            let labels = [];
            let hours = 0;
            let minutes = 0;
            while (hours < 24) {
                while (minutes < 60) {
                    labels.push(
                        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
                    );
                    minutes += 5;
                }
                hours++;
                minutes = 0;
            }

            return labels;
        }

        fiveMinutesLabels = generateTimeLabels();

        let time = new Date();
        time.setHours(0, 0, 0, 0);

        let today = eventLog.filter(
            (timestamp) =>
                timestamp >= time &&
                timestamp < time.getTime() + 24 * 60 * 60000,
        );

        console.log("today", today);

        let date = new Date();
        date.setHours(0, 0, 0, 0);

        let prevButton = document.getElementById("prev-day-button");
        let nextButton = document.getElementById("next-day-button");
        let dateLabel = document.getElementById("current-date-statistics");
        dateLabel.textContent = date.toDateString();

        prevButton.addEventListener("click", () => {
            date.setDate(date.getDate() - 1);
            dateLabel.textContent = date.toDateString();
        });

        nextButton.addEventListener("click", () => {
            date.setDate(date.getDate() + 1);
            dateLabel.textContent = date.toDateString();
        });

        function getFiveMinuteIntervals(date) {
            let interval = 5 * 60000;

            let result = [];

            for (let i = 0; i < 288; i++) {
                result.push(date.getTime() + i * interval);
            }

            return result;
        }

        console.log("intervals", getFiveMinuteIntervals(date));

        let todayIntervals = [];
        getFiveMinuteIntervals(date).forEach((interval) => {
            todayIntervals.push(
                today.filter(
                    (timestamp) =>
                        timestamp >= interval &&
                        timestamp < interval + 5 * 60000,
                ),
            );
        });
        console.log(todayIntervals.map((interval) => interval.length));

        // line chart
        const ctx2 = document
            .getElementById("page-per-5-minutes")
            .getContext("2d");
        const myChart2 = new Chart(ctx2, {
            type: "line",
            data: {
                labels: fiveMinutesLabels,
                datasets: [
                    {
                        label: "Number of Events",
                        // data: [12, 19, 3, 5, 2, 3, 10],
                        data: todayIntervals.map((interval) => interval.length),
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                responsive: false,
            },
        });
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

// Toggle the value of a restriction in storage
function toggleRestriction(key) {
    chrome.storage.local.get([key]).then((result) => {
        chrome.storage.local.set({ [key]: !result[key] });
    });
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
        presetRestrictions.forEach((restriction) => {
            chrome.storage.local.set({ [restriction]: true });
        });
    }
    // Otherwise assumed to be custom

    setCheckboxes();
}

// Clear all restrictions in storage
function clearRestrictions() {
    blockingCategories.forEach((restriction) => {
        chrome.storage.local.set({ [restriction]: false });
    });
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

// Clear all preset selections in storage
function clearRadioButtons() {
    ages.forEach((radioButton) => {
        chrome.storage.local.set({ [radioButton]: false });
    });
}

// Set checkboxes to match storage values
function setCheckboxes() {
    blockingCategories.forEach((age) => {
        chrome.storage.local.get([age]).then((result) => {
            console.log(result[age]);
            document.getElementById(`${age}-checkbox`).checked = result[age];
        });
    });
}

// Set the new password
function submitPassword() {
    const [oldPassword, newPassword, newPasswordConfirmation] = [
        "old-password-field",
        "new-password-field",
        "confirm-new-password-field",
    ].map((id) => document.getElementById(id).value);

    chrome.storage.local.get(["password"]).then((result) => {
        if (oldPassword !== result.password)
            return alert("Incorrect password. Please try again.");
    });

    if (!newPassword)
        return alert("New password cannot be empty. Please try again.");

    if (newPassword !== newPasswordConfirmation)
        return alert("New passwords do not match. Please try again.");

    chrome.storage.local.set({ password: newPassword });
    chrome.storage.local.set({ authenticated: false });
    window.location.href = "barrier.html";
}
