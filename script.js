/* =========================================================
   LABELGUARD FRONTEND
   Frontend prototype: local demo data only, no real OCR/backend.
   ========================================================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/webp"
]);
const STORAGE_KEY = "labelguard_inspections";
const SESSION_KEY = "labelguard_demo_session";
const USER_KEY = "labelguard_demo_user";
const DEMO_SCORE = 87;

/* ================= DEMO SESSION GUARD ================= */

if (localStorage.getItem(SESSION_KEY) !== "active") {
    window.location.replace("login.html");
}

let selectedFile = null;
let currentPage = "dashboard";
let toastTimer;
let analysisTimer = null;
let analysisRunId = 0;

const $ = (id) => document.getElementById(id);

/* ================= DOM REFERENCES ================= */

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const breadcrumb = $("breadcrumb");

const dropZone = $("drop-zone");
const fileInput = $("file-input");
const browseBtn = $("browse-btn");
const uploadContent = $("upload-content");
const previewContainer = $("preview-container");
const previewImage = $("preview-image");
const fileName = $("file-name");
const fileSize = $("file-size");
const removeImageBtn = $("remove-image");

const demoBtn = $("demo-btn");
const analyzeBtn = $("analyze-btn");
const loader = $("analysis-loader");
const resultsSection = $("results-section");
const progressBar = $("progress-bar");
const analysisStep = $("analysis-step");

const historySearch = $("history-search");
const historyStatus = document.querySelector("#history .filter-bar select");
const historyTableBody = document.querySelector("#history-table tbody");
const toast = $("toast");
const toastTitle = $("toast-title");
const toastMessage = $("toast-message");

/* ================= ACCESSIBILITY / SEMANTICS ================= */

function improveAccessibility() {
    const nav = document.querySelector(".navigation");
    if (nav) nav.setAttribute("aria-label", "Primary navigation");

    document.querySelectorAll(".nav-item").forEach((button) => {
        button.type = "button";
    });

    document.querySelectorAll("button").forEach((button) => {
        if (!button.type) button.type = "button";
    });

    const iconButton = document.querySelector(".icon-button");
    if (iconButton) iconButton.setAttribute("aria-label", "View notifications");

    const moreButton = document.querySelector(".more-btn");
    if (moreButton) {
        moreButton.textContent = "Logout";
        moreButton.setAttribute("aria-label", "Log out of LabelGuard");
        moreButton.title = "Log out";
    }

    document.querySelectorAll(".row-btn").forEach((button) => {
        button.setAttribute("aria-label", "View inspection actions");
    });

    document.querySelectorAll(".form-group label").forEach((label) => {
        const input = label.parentElement?.querySelector("input, textarea, select");
        if (input && !label.htmlFor) {
            if (!input.id) input.id = `field-${Math.random().toString(36).slice(2, 9)}`;
            label.htmlFor = input.id;
        }
    });

    document.querySelectorAll("table").forEach((table) => {
        table.querySelectorAll("thead th").forEach((th) => th.setAttribute("scope", "col"));
    });

    if (dropZone) {
        dropZone.setAttribute("tabindex", "0");
        dropZone.setAttribute("role", "button");
        dropZone.setAttribute("aria-label", "Upload a product image");
    }

    if (analysisStep) analysisStep.setAttribute("aria-live", "polite");
    if (toast) {
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
    }
    if (progressBar) {
        progressBar.setAttribute("role", "progressbar");
        progressBar.setAttribute("aria-valuemin", "0");
        progressBar.setAttribute("aria-valuemax", "100");
        progressBar.setAttribute("aria-valuenow", "0");
    }

    const resultDescription = resultsSection?.querySelector(".result-header p");
    if (resultDescription) {
        resultDescription.textContent = "Frontend demo results based on simulated package declarations.";
    }

    document.querySelectorAll(".ai-tag").forEach((tag) => {
        tag.textContent = "SIMULATED ANALYSIS";
    });
}

/* ================= PAGE NAVIGATION ================= */

function openPage(pageName) {
    currentPage = pageName;

    pages.forEach((page) => page.classList.remove("active-page"));

    const selectedPage = $(pageName);
    if (selectedPage) selectedPage.classList.add("active-page");

    navItems.forEach((item) => {
        const active = item.dataset.page === pageName;
        item.classList.toggle("active", active);
        if (active) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
    });

    const names = {
        dashboard: "Dashboard",
        inspection: "New Inspection",
        history: "Inspection History",
        products: "Products",
        rules: "Rule Configuration"
    };

    if (breadcrumb) breadcrumb.textContent = names[pageName] || "Dashboard";

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (pageName === "history") renderHistory();
}

navItems.forEach((item) => {
    item.addEventListener("click", () => openPage(item.dataset.page));
});

/* ================= FILE UPLOAD ================= */

function isAllowedImage(file) {
    return file && ALLOWED_IMAGE_TYPES.has(file.type);
}

function handleFile(file) {
    if (!isAllowedImage(file)) {
        showToast("Unsupported image", "Use PNG, JPG/JPEG or WEBP files only.");
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        showToast("File too large", "Maximum allowed size is 10 MB.");
        return;
    }

    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
        previewImage.src = event.target.result;
        previewImage.alt = `Preview of ${file.name}`;
        uploadContent.classList.add("hidden");
        previewContainer.classList.remove("hidden");
    };
    reader.onerror = () => showToast("Preview failed", "The image could not be previewed.");
    reader.readAsDataURL(file);

    showToast("Image ready", "Product image loaded successfully.");
}

function clearImage() {
    selectedFile = null;
    if (fileInput) fileInput.value = "";
    if (previewImage) {
        previewImage.src = "";
        previewImage.alt = "Product preview";
    }
    previewContainer?.classList.add("hidden");
    uploadContent?.classList.remove("hidden");
}

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

if (browseBtn && fileInput) {
    browseBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        fileInput.click();
    });
}

if (dropZone && fileInput) {
    dropZone.addEventListener("click", () => {
        if (!selectedFile) fileInput.click();
    });

    dropZone.addEventListener("keydown", (event) => {
        if ((event.key === "Enter" || event.key === " ") && !selectedFile) {
            event.preventDefault();
            fileInput.click();
        }
    });

    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropZone.classList.add("dragover");
    });

    ["dragleave", "dragend"].forEach((eventName) => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove("dragover"));
    });

    dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropZone.classList.remove("dragover");
        const file = event.dataTransfer?.files?.[0];
        if (file) handleFile(file);
    });
}

fileInput?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
});

removeImageBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    clearImage();
    showToast("Image removed", "The product image has been cleared.");
});

/* ================= DEMO PRODUCT ================= */

demoBtn?.addEventListener("click", () => {
    $("product-name").value = "Premium Tomato Ketchup";
    $("brand-name").value = "Fresh Foods";
    $("manufacturer").value = "Fresh Foods Pvt. Ltd.";
    $("location").value = "Retail Store - Kolkata";
    $("notes").value = "Sample inspection loaded for demonstration.";

    clearImage();
    resultsSection?.classList.add("hidden");
    loader?.classList.add("hidden");
    if (analyzeBtn) analyzeBtn.disabled = false;

    showToast("Demo loaded", "Sample product details are ready.");
});

/* ================= ANALYSIS ================= */

const analysisSteps = [
    { text: "Preparing product image...", progress: 15 },
    { text: "Extracting label information...", progress: 35 },
    { text: "Detecting mandatory declarations...", progress: 55 },
    { text: "Validating configured rules...", progress: 75 },
    { text: "Calculating compliance score...", progress: 90 },
    { text: "Generating inspection findings...", progress: 100 }
];

function updateProgress(value) {
    if (!progressBar) return;
    progressBar.style.width = `${value}%`;
    progressBar.setAttribute("aria-valuenow", String(value));
}

function startAnalysis() {
    const productName = $("product-name")?.value.trim() || "";

    if (!selectedFile && !productName) {
        showToast("Product information required", "Upload an image or enter a product name.");
        $("product-name")?.focus();
        return;
    }

    if (analysisTimer) clearTimeout(analysisTimer);
    analysisRunId += 1;
    const runId = analysisRunId;
    let stepIndex = 0;

    resultsSection?.classList.add("hidden");
    loader?.classList.remove("hidden");
    if (analyzeBtn) analyzeBtn.disabled = true;
    updateProgress(0);

    const nextStep = () => {
        if (runId !== analysisRunId) return;

        if (stepIndex >= analysisSteps.length) {
            analysisTimer = setTimeout(() => finishAnalysis(runId), 450);
            return;
        }

        const step = analysisSteps[stepIndex++];
        if (analysisStep) analysisStep.textContent = step.text;
        updateProgress(step.progress);
        analysisTimer = setTimeout(nextStep, 650);
    };

    nextStep();
}

function finishAnalysis(runId) {
    if (runId !== analysisRunId) return;

    loader?.classList.add("hidden");
    resultsSection?.classList.remove("hidden");
    if (analyzeBtn) analyzeBtn.disabled = false;

    animateScore(DEMO_SCORE);
    showToast("Analysis complete", "Frontend demo assessment generated.");
    resultsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}

analyzeBtn?.addEventListener("click", startAnalysis);

/* ================= SCORE ANIMATION ================= */

function animateScore(targetScore) {
    const scoreElement = $("score-number");
    const scoreRing = $("score-ring");
    const resultStatus = $("result-status");
    if (!scoreElement || !scoreRing || !resultStatus) return;

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    scoreRing.style.strokeDasharray = circumference;
    scoreRing.style.strokeDashoffset = circumference;

    let current = 0;
    const timer = setInterval(() => {
        current = Math.min(current + 2, targetScore);
        scoreElement.textContent = String(current);
        scoreRing.style.strokeDashoffset = circumference - (current / 100) * circumference;

        if (current >= targetScore) clearInterval(timer);
    }, 25);

    resultStatus.textContent = targetScore >= 90
        ? "Compliant"
        : targetScore >= 70
            ? "Needs Review"
            : "Non-compliant";
}

/* ================= LOCAL INSPECTION STORAGE ================= */

function getSavedInspections() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function saveInspection() {
    const productName = $("product-name")?.value.trim() || "Unnamed Product";
    const manufacturer = $("manufacturer")?.value.trim() || "Not provided";

    const saved = getSavedInspections();
    const inspection = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        product: productName,
        manufacturer,
        score: DEMO_SCORE,
        status: "Needs Review",
        date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    };

    saved.unshift(inspection);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    renderHistory();
    showToast("Inspection saved", "Saved locally in this browser for the demo.");
    openPage("history");
}

window.saveInspection = saveInspection;

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function statusClass(status) {
    if (status === "Compliant") return "success";
    if (status === "Non-compliant") return "danger";
    return "warning";
}

function renderHistory() {
    if (!historyTableBody) return;

    const saved = getSavedInspections();
    historyTableBody.querySelectorAll("tr[data-saved-row]").forEach((row) => row.remove());

    if (!saved.length) {
        applyHistoryFilters();
        return;
    }

    const fragment = document.createDocumentFragment();

    saved.forEach((item) => {
        const row = document.createElement("tr");
        row.dataset.savedRow = "true";
        row.innerHTML = `
            <td><strong>${escapeHtml(item.product)}</strong></td>
            <td>${escapeHtml(item.manufacturer)}</td>
            <td>${escapeHtml(item.date)}</td>
            <td>${Number(item.score)}/100</td>
            <td><span class="badge ${statusClass(item.status)}">● ${escapeHtml(item.status)}</span></td>
            <td><button type="button" class="view-btn" data-inspection-id="${escapeHtml(item.id)}">View</button></td>
        `;
        fragment.appendChild(row);
    });

    historyTableBody.prepend(fragment);
    applyHistoryFilters();
}

function applyHistoryFilters() {
    if (!historyTableBody) return;

    const query = historySearch?.value.toLowerCase().trim() || "";
    const selectedStatus = historyStatus?.value || "All statuses";

    historyTableBody.querySelectorAll("tr").forEach((row) => {
        const text = row.textContent.toLowerCase();
        const statusText = row.querySelector(".badge")?.textContent || "";
        const matchesQuery = text.includes(query);
        const matchesStatus = selectedStatus === "All statuses" || statusText.includes(selectedStatus);
        row.hidden = !(matchesQuery && matchesStatus);
    });
}

historySearch?.addEventListener("input", applyHistoryFilters);
historyStatus?.addEventListener("change", applyHistoryFilters);

historyTableBody?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-inspection-id]");
    if (!button) return;

    const item = getSavedInspections().find((entry) => entry.id === button.dataset.inspectionId);
    if (!item) return;

    showToast("Inspection record", `${item.product} • ${item.score}/100 • ${item.status}`);
});

/* ================= TOAST ================= */

function showToast(title, message) {
    if (!toast || !toastTitle || !toastMessage) return;

    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

window.showToast = showToast;

/* ================= GLOBAL BUTTON ACTIONS ================= */

document.querySelector(".icon-button")?.addEventListener("click", () => {
    showToast("Notifications", "No new notifications in this frontend demo.");
});

const logoutButton = document.querySelector(".more-btn");
logoutButton?.addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.replace("login.html");
});

document.querySelectorAll(".row-btn").forEach((button) => {
    button.addEventListener("click", () => {
        showToast("Inspection actions", "Detailed row actions are planned for the backend version.");
    });
});

document.querySelectorAll(".view-btn:not([data-inspection-id])").forEach((button) => {
    button.addEventListener("click", () => {
        showToast("Inspection record", "This sample record is available for demonstration.");
    });
});

/* ================= KEYBOARD SHORTCUT ================= */

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPage("inspection");
    }
});

/* ================= INITIALIZE ================= */

improveAccessibility();
renderHistory();
openPage("dashboard");
