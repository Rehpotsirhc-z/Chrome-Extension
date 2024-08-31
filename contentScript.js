const seenImages = new Set();

function extractImageLinks() {
    const images = document.querySelectorAll("img");

    const newImageLinks = Array.from(images)
        .map((img) => img.src)
        .filter((src) => !seenImages.has(src));

    newImageLinks.forEach((src) => seenImages.add(src));

    console.log(`${newImageLinks.length} new images`);
    return newImageLinks;
}

function sendImages() {
    const imageLinks = extractImageLinks();
    try {
        if (imageLinks.length > 0) {
            chrome.runtime.sendMessage({ images: imageLinks });
        }
    } catch (error) {
        console.error("Error sending images", error);
    }
}

function extractSentences() {
    const textContent = document.body.innerText;
    const sentences = textContent.match(/[^.!?]*[.!?]/g) || [];
    return sentences;
}

function sendText() {
    const textLinks = extractSentences();
    try {
        if (textLinks.length > 0) {
            chrome.runtime.sendMessage({ text: textLinks });
        }
    } catch (error) {
        console.error("Error sending text", error);
    }
}

// Set up a MutationObserver to detect change in the DOM
const observer = new MutationObserver(() => {
    sendImages();
    sendText();
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributesFilter: ["src"],
});

document.addEventListener("DOMContentLoaded", () => {
    sendImages();
    sendText();
});
