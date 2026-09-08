/* =========================================================
   LABELGUARD FRONTEND
   ========================================================= */


/* ================= GLOBAL STATE ================= */

let selectedFile = null;
let currentPage = "dashboard";


/* ================= PAGE NAVIGATION ================= */

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const breadcrumb = document.getElementById("breadcrumb");

function openPage(pageName) {

    currentPage = pageName;

    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    navItems.forEach(item => {

        if (item.dataset.page === pageName) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }

    });

    const names = {
        dashboard: "Dashboard",
        inspection: "New Inspection",
        history: "Inspection History",
        products: "Products",
        rules: "Rule Configuration"
    };

    breadcrumb.textContent = names[pageName] || "Dashboard";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


navItems.forEach(item => {

    item.addEventListener("click", () => {

        openPage(item.dataset.page);

    });

});


/* ================= FILE UPLOAD ================= */

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const browseBtn = document.getElementById("browse-btn");

const uploadContent = document.getElementById("upload-content");
const previewContainer = document.getElementById("preview-container");
const previewImage = document.getElementById("preview-image");

const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");

const removeImageBtn = document.getElementById("remove-image");


browseBtn.addEventListener("click", event => {

    event.stopPropagation();

    fileInput.click();

});


dropZone.addEventListener("click", () => {

    if (!selectedFile) {
        fileInput.click();
    }

});


fileInput.addEventListener("change", event => {

    const file = event.target.files[0];

    if (file) {
        handleFile(file);
    }

});


dropZone.addEventListener("dragover", event => {

    event.preventDefault();

    dropZone.classList.add("dragover");

});


dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("dragover");

});


dropZone.addEventListener("drop", event => {

    event.preventDefault();

    dropZone.classList.remove("dragover");

    const file = event.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
        handleFile(file);
    }

});


function handleFile(file) {

    if (!file.type.startsWith("image/")) {

        showToast(
            "Invalid file",
            "Please select an image file."
        );

        return;
    }


    if (file.size > 10 * 1024 * 1024) {

        showToast(
            "File too large",
            "Maximum allowed size is 10 MB."
        );

        return;
    }


    selectedFile = file;

    fileName.textContent = file.name;

    fileSize.textContent =
        formatFileSize(file.size);


    const reader = new FileReader();


    reader.onload = event => {

        previewImage.src = event.target.result;

        uploadContent.classList.add("hidden");

        previewContainer.classList.remove("hidden");

    };


    reader.readAsDataURL(file);


    showToast(
        "Image ready",
        "Product image loaded successfully."
    );

}


removeImageBtn.addEventListener("click", event => {

    event.stopPropagation();

    clearImage();

});


function clearImage() {

    selectedFile = null;

    fileInput.value = "";

    previewImage.src = "";

    previewContainer.classList.add("hidden");

    uploadContent.classList.remove("hidden");

}


function formatFileSize(bytes) {

    if (bytes < 1024) {
        return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}


/* ================= DEMO PRODUCT ================= */

const demoBtn = document.getElementById("demo-btn");


demoBtn.addEventListener("click", () => {

    document.getElementById("product-name").value =
        "Premium Tomato Ketchup";

    document.getElementById("brand-name").value =
        "Fresh Foods";

    document.getElementById("manufacturer").value =
        "Fresh Foods Pvt. Ltd.";

    document.getElementById("location").value =
        "Retail Store - Kolkata";

    document.getElementById("notes").value =
        "Sample inspection loaded for demonstration.";

    showToast(
        "Demo loaded",
        "Sample product details are ready."
    );

});


/* ================= ANALYSIS ================= */

const analyzeBtn = document.getElementById("analyze-btn");

const loader = document.getElementById("analysis-loader");
const resultsSection = document.getElementById("results-section");

const progressBar = document.getElementById("progress-bar");
const analysisStep = document.getElementById("analysis-step");


analyzeBtn.addEventListener("click", startAnalysis);


function startAnalysis() {

    const productName =
        document.getElementById("product-name").value.trim();


    if (!selectedFile && !productName) {

        showToast(
            "Product information required",
            "Upload an image or enter a product name."
        );

        return;
    }


    resultsSection.classList.add("hidden");

    loader.classList.remove("hidden");

    analyzeBtn.disabled = true;

    progressBar.style.width = "0%";


    const steps = [
        {
            text: "Preparing product image...",
            progress: 15
        },
        {
            text: "Extracting label information...",
            progress: 35
        },
        {
            text: "Detecting mandatory declarations...",
            progress: 55
        },
        {
            text: "Validating Legal Metrology rules...",
            progress: 75
        },
        {
            text: "Calculating compliance score...",
            progress: 90
        },
        {
            text: "Generating inspection findings...",
            progress: 100
        }
    ];


    let stepIndex = 0;


    function nextStep() {

        if (stepIndex >= steps.length) {

            finishAnalysis();

            return;
        }


        const step = steps[stepIndex];

        analysisStep.textContent = step.text;

        progressBar.style.width =
            step.progress + "%";


        stepIndex++;

        setTimeout(nextStep, 650);

    }


    nextStep();

}


/* ================= FINISH ANALYSIS ================= */

function finishAnalysis() {

    setTimeout(() => {

        loader.classList.add("hidden");

        resultsSection.classList.remove("hidden");

        analyzeBtn.disabled = false;

        animateScore(87);

        showToast(
            "Analysis complete",
            "Compliance assessment generated."
        );

    }, 500);

}


/* ================= SCORE ANIMATION ================= */

function animateScore(targetScore) {

    const scoreElement =
        document.getElementById("score-number");

    const scoreRing =
        document.getElementById("score-ring");

    const resultStatus =
        document.getElementById("result-status");

    const circumference = 314;

    const targetOffset =
        circumference -
        (targetScore / 100) * circumference;


    scoreRing.style.strokeDashoffset =
        circumference;


    let current = 0;


    const timer = setInterval(() => {

        current += 2;

        if (current >= targetScore) {

            current = targetScore;

            clearInterval(timer);

        }


        scoreElement.textContent = current;


        const offset =
            circumference -
            (current / 100) * circumference;


        scoreRing.style.strokeDashoffset =
            offset;

    }, 25);


    if (targetScore >= 90) {

        resultStatus.textContent =
            "Compliant";

    } else if (targetScore >= 70) {

        resultStatus.textContent =
            "Needs Review";

    } else {

        resultStatus.textContent =
            "Non-compliant";

    }

}


/* ================= SAVE INSPECTION ================= */

function saveInspection() {

    const productName =
        document.getElementById("product-name").value ||
        "Unnamed Product";


    const inspection = {

        product: productName,

        manufacturer:
            document.getElementById("manufacturer").value ||
            "Not provided",

        score: 87,

        status: "Needs Review",

        date: new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        )

    };


    const saved =
        JSON.parse(
            localStorage.getItem("labelguard_inspections") ||
            "[]"
        );


    saved.unshift(inspection);


    localStorage.setItem(
        "labelguard_inspections",
        JSON.stringify(saved)
    );


    showToast(
        "Inspection saved",
        "The inspection has been added to your repository."
    );

}


/* ================= SEARCH ================= */

const historySearch =
    document.getElementById("history-search");


if (historySearch) {

    historySearch.addEventListener("input", () => {

        const query =
            historySearch.value.toLowerCase().trim();


        const rows =
            document.querySelectorAll(
                "#history-table tbody tr"
            );


        rows.forEach(row => {

            const text =
                row.textContent.toLowerCase();


            row.style.display =
                text.includes(query)
                    ? ""
                    : "none";

        });

    });

}


/* ================= TOAST ================= */

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toast-title");

const toastMessage =
    document.getElementById("toast-message");


let toastTimer;


function showToast(title, message) {

    toastTitle.textContent = title;

    toastMessage.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3200);

}


/* ================= KEYBOARD SHORTCUT ================= */

document.addEventListener("keydown", event => {

    if (
        event.ctrlKey &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();

        openPage("inspection");

    }

});


/* ================= INITIALIZE ================= */

document.addEventListener("DOMContentLoaded", () => {

    openPage("dashboard");

});
