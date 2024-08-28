base_url = "http://localhost:5000";
image_url = `${base_url}/predict_image`
text_url = `${base_url}/predict_text`

function dataUrlToBlob(dataUrl) {
    const [header, data] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const array = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }

    return new Blob([array], { type: mime });
}

async function downloadImage(url) {
    if (!url) return;
    let blob;

    if (url.startsWith("data:")) {
        blob = dataUrlToBlob(url);
    } else {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.log(`Failed to fetch image from URL: "${url}"`);
                return null;
            }
            blob = await response.blob();
        } catch (error) {
            console.error(`Error fetching image from URL (${url}):`, error);
            return null;
        }
    }

    if (!blob.type.startsWith("image/")) {
        console.log(`Skipping non-image URL: "${url}" | Type: "${blob.type}"`);
        return null;
    }

    if (blob.type.startsWith("image/svg")) {
        console.log(`Skipping SVG image from URL: "${url}"`);
        return null;
    }

    try {
        // Create an ImageBitmap to access image dimensions
        const img = await createImageBitmap(blob);

        if (img.width < 32 || img.height < 32) {
            // console.log(
            //     `Skipping image from URL: "${url}" | Dimensions: ${img.width}x${img.height}`,
            // );
            return null;
        }

        // // Create an offscreen canvas to process the image
        // const canvas = new OffscreenCanvas(img.width, img.height);
        // const ctx = canvas.getContext("2d");
        // ctx.drawImage(img, 0, 0);

        // // Convert canvas content to JPEG
        // const jpgBlob = await canvas.convertToBlob({
        //     type: "image/jpeg",
        //     quality: 1,
        // });

        // const filename = url.split("/").pop().split(".").shift() + ".jpg";

        return new File([blob], "image", { type: "image/jpeg" });
    } catch (error) {
        console.error(`Error processing image from URL (${url}):`, error);
        return null;
    }
}

chrome.runtime.onMessage.addListener(async (request) => {
    if (request.images) {
        console.log(request.images.length, "images to process");
        const categoryCount = {};

        // Download all images concurrently and keep track of URLs
        const imagePromises = request.images.map(async (imageLink) => {
            const image = await downloadImage(imageLink);
            return { image, imageLink };
        });

        const imagesWithUrls = (await Promise.all(imagePromises)).filter(
            ({ image }) => image,
        );

        console.log(imagesWithUrls.length, "images downloaded");

        // Create and send requests for all images concurrently
        const predictionPromises = imagesWithUrls.map(
            async ({ image, imageLink }) => {
                try {
                    const formData = new FormData();
                    formData.append("image", image);

                    const response = await fetch(image_url, {
                        method: "POST",
                        body: formData,
                    });

                    const { predictions: [prediction] = [] } =
                        await response.json();

                    if (prediction) {
                        const { class: className, confidence } = prediction;
                        if (className !== "background") {
                            console.log(
                                `URL: ${imageLink} | Prediction: ${className} (${(confidence * 100).toFixed(2)}%)`,
                            );
                        }

                        categoryCount[className] =
                            (categoryCount[className] || 0) + 1;
                    } else {
                        categoryCount["background"] =
                            (categoryCount["background"] || 0) + 1;
                    }
                } catch (error) {
                    console.error(
                        `Error getting predictions from URL (${imageLink}):`,
                        error,
                    );
                }
            },
        );

        await Promise.all(predictionPromises);

        console.log("Category counts:");
        Object.entries(categoryCount).forEach(([category, count]) => {
            console.log(`${category}: ${count}`);
        });
    } else if (request.text) {
        console.log(request.text.length, "text to process");
        const categoryCount = {};

        const predictionPromises = request.text.map(
            async (text) => {
                try {
                    const formData = new FormData();
                    formData.append("text", text);

                    const response = await fetch(text_url, {
                        method: "POST",
                        body: formData,
                    });

                    const { predictions: [prediction] = [] } =
                        await response.json();

                    if (prediction) {
                        const { class: className, confidence } = prediction;
                        if (className !== "background") {
                            console.log(
                                `Text: ${text} | Prediction: ${className} (${(confidence * 100).toFixed(2)}%)`,
                            );
                        } 

                        categoryCount[className] =
                            (categoryCount[className] || 0) + 1;
                    } else {
                        console.log(
                            `Text: ${text} | Prediction: background`,
                        );
                        categoryCount["background"] =
                            (categoryCount["background"] || 0) + 1;
                    }
                } catch (error) {
                    console.error(
                        `Error getting predictions`,
                        error,
                    );
                }
            },
        );

        await Promise.all(predictionPromises);

        console.log("Category counts:");
        Object.entries(categoryCount).forEach(([category, count]) => {
            console.log(`${category}: ${count}`);
        });

    }
});
