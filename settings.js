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
    const presets = document.querySelectorAll('.blocking-preset');

    presets.forEach(preset => {
        const observer = new ResizeObserver(() => {
            const expanded = document.getElementById(`${preset.getAttribute('data-target').replace("#", "")}-expanded`);
            if (expanded) {
                expanded.style.width = `${preset.offsetWidth}px`;
            }
        });

        observer.observe(preset);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");
    const changePasswordButton = document.getElementById("change-password-button");
    var changePasswordPrompt = document.getElementById("change-password-prompt");
    var submitPasswordButton = document.getElementById("change-password-submit-button");
    const newPasswordConfirmation = document.getElementById("confirm-new-password-field");
    // const ages3To5ExpandButton = document.getElementById("ages-3-to-5-expand-button");
    // const ages6To12ExpandButton = document.getElementById("ages-6-to-12-expand-button");
    // const ages13To18ExpandButton = document.getElementById("ages-13-to-18-expand-button");

    const expandButtonIds = [
        "ages-3-to-5-expand-button",
        "ages-6-to-12-expand-button",
        "ages-13-to-18-expand-button",
        "custom-expand-button"
    ];


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

    document.querySelectorAll('.blocking-preset')
        .forEach(preset => preset.addEventListener("click", toggleRadioButton));

    document.querySelectorAll('.blocking-checkbox').forEach(div => {
        div.addEventListener('click', (event) => {
            // Prevent clicks from propagating to parent elements
            event.stopPropagation();
            const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
        });
    });

    expandButtonIds.forEach(buttonId => {
        const sectionId = buttonId.replace("expand-button", "expanded");
        document.getElementById(buttonId).addEventListener("click", event =>
            toggleExpandButton(event, sectionId)
        );
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
    });

    submitPasswordButton.addEventListener("click", submitPassword);
    newPasswordConfirmation.onkeydown = function (e) {
        if (e.key === "Enter") {
            submitPassword();
        }
    };

});

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