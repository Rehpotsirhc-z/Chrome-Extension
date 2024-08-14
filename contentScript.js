function extractImageLinks() {
    console.log("imageasd");
    const images = document.querySelectorAll("img");
    const imageLinks = [];
    images.forEach((image) => {
        imageLinks.push(image.src);
    });
    console.log(imageLinks);
    return imageLinks;
}

chrome.runtime.sendMessage({
    images: extractImageLinks(),
});
