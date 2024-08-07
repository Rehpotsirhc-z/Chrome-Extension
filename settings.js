function openTab(evt, tabName) {
    document.querySelectorAll(".tabcontent")
        .forEach(element => element.style.display = "none");

    document.querySelectorAll(".tablink")
        .forEach(element => element.classList.remove("active"));

    // console.log("Active tabName: ", tabName);
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


function toggleExpandButton(event, sectionId) {
    var section = document.getElementById(sectionId);
    if (section.classList.contains("expanded")) {
        section.classList.remove("expanded");
        section.style.maxHeight = "0px";
    } else {
        section.classList.add("expanded");
        section.style.maxHeight = section.scrollHeight + 10 + "px";
    }
}


function toggleRadioButton(event) {
    var targetID = this.getAttribute("data-target").replace("#", "");
    let radioButton = document.getElementById(targetID);
    radioButton.checked = true;
}


function observePresetResize() {
    const presets = document.querySelectorAll(".blocking-preset");

    presets.forEach(preset => {
        const observer = new ResizeObserver(() => {
            const expanded = document.getElementById(`${preset.getAttribute("data-target").replace("#", "")}-expanded`);
            if (expanded) {
                expanded.style.width = `${preset.offsetWidth}px`;
            }
        });

        observer.observe(preset);
    });
}

function clearRadioButtons() {
    const radioButtons = [
        "ages-3-to-5",
        "ages-6-to-12",
        "ages-13-to-18",
        "custom"
    ]

    radioButtons.forEach(radioButton => {
        localStorage.setItem(radioButton, false);
    })
}

function clearRestrictions() {
    const restrictions = [
        "profanity",
        "web-based-games",
        "social-media-and-forums",
        "monetary-transactions",
        "explicit-content",
        "drugs",
        "gambling"
    ]

    restrictions.forEach(restriction => {
        localStorage.setItem(restriction, false);
    })
}


document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");
    const changePasswordButton = document.getElementById("change-password-button");
    var changePasswordPrompt = document.getElementById("change-password-prompt");
    var submitPasswordButton = document.getElementById("change-password-submit-button");
    const oldPasswordField = document.getElementById("old-password-field");
    const newPasswordField = document.getElementById("confirm-new-password-field");
    const newPasswordConfirmationField = document.getElementById("confirm-new-password-field");
    // const ages3To5ExpandButton = document.getElementById("ages-3-to-5-expand-button");
    // const ages6To12ExpandButton = document.getElementById("ages-6-to-12-expand-button");
    // const ages13To18ExpandButton = document.getElementById("ages-13-to-18-expand-button");

    const expandButtonIds = [
        "ages-3-to-5-expand-button",
        "ages-6-to-12-expand-button",
        "ages-13-to-18-expand-button",
        "custom-expand-button"
    ];

    const radioButtonIds = [
        "ages-3-to-5",
        "ages-6-to-12",
        "ages-13-to-18",
        "custom"
    ]

    // Custom blocking checkboxes
    const customCheckboes = [
        "profanity-input",
        "web-based-games-input",
        "social-media-and-forums-input",
        "monetary-transactions-input",
        "explicit-content-input",
        "drugs-input",
        "gambling-input"
    ]

    customCheckboes.forEach(checkbox => {
        document.getElementById(checkbox).addEventListener("click", () => {
            toggleRestriction(checkbox);
        });
    });



    const authenticated = localStorage.getItem("authenticated");

    if (authenticated === null || authenticated === "false" || authenticated === false) {
        window.location.href = "barrier.html";
    }

    document.querySelectorAll(".tablink").forEach(tabLink => {
        tabLink.addEventListener("click", (event) => {
            // Use event.currentTarget to get the clicked element
            const href = event.currentTarget.getAttribute("href");
            openTab(event, href.replace("#", ""));
        });
    });


    document.querySelector(".tablink").click();

    observePresetResize();

    document.querySelectorAll(".blocking-checkbox").forEach(div => {
        div.addEventListener("click", (event) => {
            // Prevent clicks from propagating to parent elements
            event.stopPropagation();
            const checkbox = event.currentTarget.querySelector("input[type=\"checkbox\"]");
            checkbox.checked = !checkbox.checked;
        });
    });

    expandButtonIds.forEach(buttonId => {
        const sectionId = buttonId.replace("expand-button", "expanded");
        document.getElementById(buttonId).addEventListener("click", event =>
            toggleExpandButton(event, sectionId)
        );
    });

    document.querySelectorAll(".blocking-preset")
        .forEach(preset => preset.addEventListener("click", toggleRadioButton));

    radioButtonIds.forEach(radioButtonId => {
        if (localStorage.getItem(radioButtonId) === "true") {
            document.getElementById(radioButtonId).checked = true;
        }

        const presetButton = document.getElementById((`${radioButtonId}-preset`).replace("#", ""));

        presetButton.addEventListener("click", event => {
            clearRadioButtons();
            applyRestrictions(radioButtonId);
            localStorage.setItem(radioButtonId, true);
        });


        // SAME AS PRESETBUTTON
        // document.getElementById(radioButtonId).addEventListener("click", event => {
        //     console.log("Radio button clicked");
        //     const id = radioButtonId;
        //     applyRestrictions(id);
        // });
    });


    logoutButton.addEventListener("click", () => {
        const authenticated = localStorage.getItem("authenticated");

        if (authenticated !== null || authenticated === "true" || authenticated === true) {
            localStorage.setItem("authenticated", false);
            // wait for 1 second before redirecting
            // setTimeout(() => {
            //     window.location.href = "settings.html";
            // }, 1000);
            window.location.href = "barrier.html";
        }
    });

    changePasswordButton.addEventListener("click", () => {
        changePasswordPrompt.style.display = "flex";
        oldPasswordField.focus();
    });

    submitPasswordButton.addEventListener("click", submitPassword);

    document.onkeydown = e => {
        if (e.key === "Escape" && changePasswordPrompt.style.display !== "none") {
            changePasswordPrompt.style.display = "none";
            e.preventDefault();
        }
    }

    newPasswordConfirmationField.onkeydown = e => {
        if (e.key === "Enter") {
            submitPassword();
            e.preventDefault();
        }
    };

    // CHART/STATISTICS LOGIC
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
        type: "pie",
        date: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: "# of Votes",
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)", // Red
                    "rgba(54, 162, 235, 0.2)", // Blue
                    "rgba(255, 206, 86, 0.2)", // Yellow
                    "rgba(75, 192, 192, 0.2)", // Green
                    "rgba(153, 102, 255, 0.2)", // Purple
                    "rgba(255, 159, 64, 0.2)" // Orange
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)", // Red
                    "rgba(54, 162, 235, 1)", // Blue
                    "rgba(255, 206, 86, 1)", // Yellow
                    "rgba(75, 192, 192, 1)", // Green
                    "rgba(153, 102, 255, 1)", // Purple
                    "rgba(255, 159, 64, 1)" // Orange
                ],
                borderWidth: 1
            }]
        }
    });


});

function toggleRestriction(id) {
    const restriction = id.replace("-input", "");
    const isChecked = localStorage.getItem(restriction) === "true";

    localStorage.setItem(restriction, !isChecked);
}

function applyRestrictions(id) {
    switch (id) {
        case "ages-3-to-5":
            clearRestrictions();
            presetRestrictions = [
                "profanity",
                "web-based-games",
                "social-media-and-forums",
                "monetary-transactions",
                "explicit-content",
                "drugs",
                "gambling"
            ]
            presetRestrictions.forEach(restriction => {
                localStorage.setItem(restriction, true);
            });
            // localStorage.setItem(restriction, true);
            break;
        case "ages-6-to-12":
            clearRestrictions();
            presetRestrictions = [
                "profanity",
                "social-media-and-forums",
                "monetary-transactions",
                "explicit-content",
                "drugs",
                "gambling"
            ]
            presetRestrictions.forEach(restriction => {
                localStorage.setItem(restriction, true);
            });
            break;
        case "ages-13-to-18":
            clearRestrictions();
            presetRestrictions = [
                "explicit-content",
                "drugs",
                "gambling"
            ]
            presetRestrictions.forEach(restriction => {
                localStorage.setItem(restriction, true);
            });
            break;
        case "custom":
            setCheckboxes();
            // clearRestrictions();
            break;
    }
    setCheckboxes();
}

function setCheckboxes() {
    const customCheckboxes = [
        "profanity-input",
        "web-based-games-input",
        "social-media-and-forums-input",
        "monetary-transactions-input",
        "explicit-content-input",
        "drugs-input",
        "gambling-input"
    ]

    customCheckboxes.forEach(checkbox => {
        const isChecked = localStorage.getItem(checkbox.replace("-input", "")) === "true";
        document.getElementById(checkbox).checked = isChecked;
    });
}

function submitPassword() {
    const oldPassword = document.getElementById("old-password-field").value;
    const newPassword = document.getElementById("new-password-field").value;
    const newPasswordConfirmation = document.getElementById("confirm-new-password-field").value;

    if (oldPassword === localStorage.getItem("password") && newPassword === newPasswordConfirmation && newPassword !== null && newPassword !== "") {
        localStorage.setItem("password", newPassword);
        localStorage.setItem("authenticated", false);
        window.location.href = "barrier.html";
    } else if (oldPassword !== localStorage.getItem("password")) {
        alert("Incorrect password. Please try again.");
    } else if (newPassword === null || newPassword === "") {
        alert("New password cannot be empty. Please try again.");
    }
}