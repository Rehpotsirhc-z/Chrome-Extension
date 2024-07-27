function openTab(evt, tabName) {
    Array.from(document.getElementsByClassName("tabcontent"))
        .forEach(element => element.style.display = "none");

    Array.from(document.getElementsByClassName("tablink"))
        .forEach(element => element.className = element.className.replace(" active", ""));

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


document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logout-button");
    // const ages3To5ExpandButton = document.getElementById("ages-3-to-5-expand-button");
    // const ages6To12ExpandButton = document.getElementById("ages-6-to-12-expand-button");
    // const ages13To18ExpandButton = document.getElementById("ages-13-to-18-expand-button");
    const expandButtonIds = [
        "ages-3-to-5-expand-button",
        "ages-6-to-12-expand-button",
        "ages-13-to-18-expand-button"
    ];


    // console.log(localStorage.getItem("authenticated"));
    if (localStorage.getItem("authenticated") === null || localStorage.getItem("authenticated") === "false" || localStorage.getItem("authenticated") === false) {
        window.location.href = "barrier.html";
    }

    Array.from(document.getElementsByClassName("tablink")).forEach(tabLink => {
        tabLink.addEventListener("click", function (event) {
            openTab(event, this.getAttribute("href").replace("#", ""));
        });
    });


    document.querySelector(".tablink").click();


    Array.from(document.getElementsByClassName("blocking-preset"))
        .forEach(preset => preset.addEventListener("click", toggleRadioButton));


    expandButtonIds.forEach(buttonId => {
        const sectionId = buttonId.replace("expand-button", "expanded");
        document.getElementById(buttonId).addEventListener("click", event => 
            toggleExpandButton(event, sectionId)
        );
    });


    logoutButton.addEventListener("click", function () {
        const password = localStorage.getItem("password");
        const authenticated = localStorage.getItem("authenticated");

        if (authenticated !== null || authenticated === "true" || authenticated === true) {
            localStorage.setItem("authenticated", false);
            console.log(localStorage.getItem("authenticated"));
            // wait for 1 second before redirecting
            // setTimeout(() => {
            //     window.location.href = "settings.html";
            // }, 1000);
            window.location.href = "barrier.html";
        }
    });
});