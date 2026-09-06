const imageInput = document.getElementById("productImage");

const previewContainer =
    document.getElementById("previewContainer");

const previewImage =
    document.getElementById("previewImage");

const fileName =
    document.getElementById("fileName");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const loading =
    document.getElementById("loading");

const results =
    document.getElementById("results");


// -----------------------------------
// IMAGE UPLOAD
// -----------------------------------

imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    fileName.textContent = file.name;


    // Create temporary URL for preview

    const imageURL =
        URL.createObjectURL(file);

    previewImage.src = imageURL;

    previewContainer.classList.remove("hidden");

});


// -----------------------------------
// ANALYZE PRODUCT
// -----------------------------------

analyzeBtn.addEventListener("click", function () {

    if (!imageInput.files[0]) {

        alert("Please upload a product image first.");

        return;
    }


    // Hide upload section button

    analyzeBtn.disabled = true;

    analyzeBtn.textContent = "Analyzing...";


    // Show loading screen

    loading.classList.remove("hidden");


    // Simulate AI/OCR processing

    setTimeout(function () {

        loading.classList.add("hidden");

        results.classList.remove("hidden");

        analyzeBtn.disabled = false;

        analyzeBtn.textContent = "Analyze Product";


        // Scroll to results

        results.scrollIntoView({
            behavior: "smooth"
        });

    }, 2500);

});


// -----------------------------------
// REPORT BUTTON
// -----------------------------------

const reportBtn =
    document.getElementById("reportBtn");


reportBtn.addEventListener("click", function () {

    alert(
        "Inspection report generated successfully!"
    );

});