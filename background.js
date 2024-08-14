url = "http://localhost:5000/predict";

async function downloadImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();

    // Create an offscreen canvas to process the image
    const img = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Convert canvas content to JPEG
    const jpgBlob = await canvas.convertToBlob({
        type: "image/jpeg",
        quality: 1,
    });

    const filename = url.split("/").pop().split(".").shift() + ".jpg";
    return new File([jpgBlob], filename, { type: "image/jpeg" });
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.images) {
        request.images.forEach(async (imageLink) => {
            const image = await downloadImage(imageLink);
            const formData = new FormData();
            formData.append("file", image);

            fetch(url, {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data["predictions"][0]);
                });
        });
    }
});
