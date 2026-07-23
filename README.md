# 📊 Minimalist & Responsive BMI Calculator

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Here-blue?style=for-the-badge&logo=githubpages&logoColor=white)](https://rahulxdev1201.github.io/bmi-calculator/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Built With HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A clean, light-weight, and responsive front-end web application built for calculating Body Mass Index (BMI). It accepts user metrics (height in centimeters and weight in kilograms), performs real-time validation, computes accurate BMI values, and visually categorizes health ranges with clear dynamic feedback.

---

## ✨ Key Features

* **📱 Fully Responsive Grid System:** Fluid design system that scales smoothly from smartphones to widescreen desktop displays.
* **🛡️ Defensive Input Validation:** Handles empty payloads, alphabetic characters, and mathematically impossible physical values with friendly user micro-copy.
* **🎨 Dynamic Visual Cues:** Injects context-aware UI color schemes depending on the calculated health category (Underweight, Normal weight, Overweight, Obese).
* **⚡ Smooth Animations:** Uses `cubic-bezier` dynamic CSS transforms to seamlessly animate output scores and health indicators without layout shifts.
* **🚀 Zero Build Step:** Lightweight architecture running pure modern Vanilla JS and CDN-based Tailwind CSS—no heavy node modules or bundlers needed.

---

## 🎯 BMI Health Categories Reference

The application calculates score metrics using standard World Health Organization (WHO) ranges:

| BMI Range ($kg/m^2$) | Health Category | Visual Indicator |
| :--- | :--- | :--- |
| **< 18.5** | Underweight | 🟦 Blue |
| **18.5 – 24.9** | Normal Weight | 🟩 Green |
| **25.0 – 29.9** | Overweight | 🟨 Yellow / Orange |
| **≥ 30.0** | Obese | 🟥 Red |

---

## 🛠️ Built With

* **HTML5:** Semantic element structure for accessibility and SEO.
* **Tailwind CSS:** Utility-first CSS via CDN for rapid responsive layout styling.
* **Vanilla Modern JavaScript (ES6+):** Lightweight DOM manipulation, validation logic, and state management without heavy framework overhead.

---

## 📂 Project Structure
```text
bmi-calculator/
├── index.html        # Main HTML structure & dynamic Tailwind layout
├── style.css         # Custom animations & fallback CSS override rules
├── script.js         # Math logic, UI state bindings, and input validation
└── README.md         # Project documentation
```
---

## 🚀 Quickstart & Local Setup
Deploy this project to your local runtime environment without complex build tooling:

## Clone the repository:
```text
Bash
git clone [https://github.com/RaHuLxDeV1201/bmi-calculator.git](https://github.com/RaHuLxDeV1201/bmi-calculator.git)
```
## Navigate into the project directory:
```text
Bash
cd bmi-calculator
```
## Launch the app:
```text
Direct: Double-click index.html to open it in your browser.

Live Server (VS Code): Right-click index.html and select "Open with Live Server".
```
## 📜 License
Distributed under the MIT License. See LICENSE for more information.

## Key Improvements Made:

* **Completed Local Setup:** Added step 2 (cd bmi-calculator) and step 3 (launch options) which were previously missing.

* **Added Tech & Status Badges:** Clean visual indicators at the top for GitHub Pages, license, and technologies used.

* **Reference Table:** Included a quick WHO BMI Category table so users understand what outputs to expect.

* **Project Structure:** Added a file-tree breakdown to make the project architecture clear at a glance.

* **Contributing & License:** Included standard open-source sections to make the repo look complete.
