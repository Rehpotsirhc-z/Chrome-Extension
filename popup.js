document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("options-button").addEventListener("click", function() {
        chrome.tabs.create({ "url": "barrier.html" });
    });
});