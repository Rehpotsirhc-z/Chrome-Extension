const seenImages = new Set();

function extractImageLinks() {
    const images = document.querySelectorAll("img");

    const newImageLinks = Array.from(images)
        .filter((img) => !seenImages.has(img.src))
        .map((img) => {
            img.dataset.originalSrc = img.src;
            if (img.srcset !== "") {
                img.dataset.originalSrcset = img.srcset;
                img.srcset = "";
            }
            img.src = "";
            img.alt = "";

            seenImages.add(img.src);
            return img.dataset.originalSrc;
        });

    // newImageLinks.forEach((src) => seenImages.add(src));

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
    //     // attributes: true,
    //     // attributesFilter: ["src"],
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "removeImage" && message.imageLink) {
        console.log("Removing image", message.imageLink);

        const images = document.querySelectorAll(
            `img[src="${message.imageLink}"]`,
        );
        images.forEach((image) => {
            if (image.srcset !== "") {
                image.srcset = "";
                image.removeAttribute("data-original-srcset");
            }
            image.removeAttribute("data-original-src");
            image.src = "";
            image.alt = "";
        });
    } else if (message.action === "revealImage" && message.imageLink) {
        console.log("Revealing image", message.imageLink);

        const images = document.querySelectorAll(
            `img[src=""], img[data-original-src="${message.imageLink}"]`,
        );
        images.forEach((image) => {
            image.src = image.dataset.originalSrc;
            if (image.srcset) {
                image.srcset = image.dataset.originalSrcset;
            }
            image.removeAttribute("data-original-src");
            image.removeAttribute("data-original-srcset");
        });
    }
});

window.addEventListener("load", () => {
    sendImages();
    sendText();
});

// document.addEventListener("DOMContentLoaded", () => {
//     sendImages();
//     sendText();
// });

sendImages();
