# LabelGuard

### Compliance Intelligence & Packaging Verification

[![Live Demo](https://img.shields.io/badge/Live%20Demo-LabelGuard-0f766e?style=for-the-badge)](https://baintanay007.github.io/LabelGuard/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=111827)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> A frontend prototype for inspecting packaged-product labels, reviewing regulatory declarations, and presenting compliance results in an enforcement-oriented workspace.

**Live application:** https://baintanay007.github.io/LabelGuard/

---

## Overview

LabelGuard is a web-based compliance inspection interface designed around the workflow of regulatory officers, quality-assurance teams, and product auditors.

The application provides a structured workspace for reviewing product labels, tracking inspections, examining compliance results, and managing inspection rules. The current implementation is a **frontend prototype** with simulated inspection data and client-side interactions.

## Key Features

- **Compliance Dashboard** with inspection metrics and activity visualization
- **New Inspection** workflow with product-image upload and preview
- **Inspection History** for reviewing previous assessments
- **Product Workspace** for organizing inspected products
- **Rule Configuration** interface for compliance criteria
- **Compliance Scoring** with status categories such as Compliant, Needs Review, and Non-compliant
- **Responsive interface** designed for desktop and smaller screens
- **Clean enforcement-oriented UI** focused on fast review and decision making

## Compliance Checks Represented

The interface is designed around common packaged-product declarations, including:

- Manufacturer / packer name and address
- Net quantity and unit of measure
- Maximum Retail Price (MRP) / unit sale price
- Manufacturing and expiry / best-before information
- Consumer care / grievance information
- Ingredients and nutritional information

> **Important:** These checks are represented as a product concept and frontend demonstration. LabelGuard should not be treated as a certified legal or regulatory compliance system without validated rules, authoritative regulatory sources, and appropriate testing.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| HTML5 | Application structure and semantic markup |
| CSS3 | Responsive layout, components, and visual design |
| JavaScript | Navigation, interactions, upload handling, and UI logic |
| GitHub Pages | Static deployment |

## Project Structure

```text
LabelGuard/
├── index.html     # Main application interface
├── style.css      # Application styling and responsive layout
├── script.js      # Client-side interactions and UI logic
└── README.md      # Project documentation
```

## Getting Started

### Run locally

1. Clone the repository:

```bash
git clone https://github.com/baintanay007/LabelGuard.git
```

2. Open the project directory:

```bash
cd LabelGuard
```

3. Open `index.html` in a modern web browser.

No build step or package installation is required for the current frontend implementation.

## Development Notes

LabelGuard is intentionally built as a lightweight frontend prototype. The interface can later be extended with a real backend, OCR/computer-vision pipeline, persistent inspection records, authenticated users, and versioned regulatory rules.

## Future Direction

Potential next steps include:

- OCR-assisted declaration extraction
- Image preprocessing and label-region detection
- Backend-based inspection storage
- Configurable and versioned regulatory rule sets
- Evidence-based compliance explanations
- Exportable inspection reports
- Authentication and role-based access
- Automated testing and CI/CD

## Author

**Tanay Bain**  
BSc Computer Science (Honours) student

GitHub: https://github.com/baintanay007

---

## License

No open-source license has currently been declared for this project. All rights remain with the repository owner unless otherwise stated.
