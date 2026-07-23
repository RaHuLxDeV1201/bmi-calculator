# 📊 Minimalist & Responsive BMI Calculator

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Here-blue?style=for-the-badge&logo=githubpages&logoColor=white)](https://rahulxdev1201.github.io/bmi-calculator/)
[![Performance](https://img.shields.io/badge/Performance-97%25-brightgreen?style=for-the-badge&logo=googlechrome&logoColor=white)](https://rahulxdev1201.github.io/bmi-calculator/)
[![Accessibility](https://img.shields.io/badge/Accessibility-95%25-brightgreen?style=for-the-badge)](https://rahulxdev1201.github.io/bmi-calculator/)
[![Best Practices](https://img.shields.io/badge/Best_Practices-100%25-brightgreen?style=for-the-badge)](https://rahulxdev1201.github.io/bmi-calculator/)
[![SEO](https://img.shields.io/badge/SEO-91%25-brightgreen?style=for-the-badge)](https://rahulxdev1201.github.io/bmi-calculator/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A clean, light-weight, and responsive front-end web application built for calculating Body Mass Index (BMI). It accepts user metrics (height in centimeters and weight in kilograms), performs real-time validation, computes accurate BMI values, and visually categorizes health ranges with clear dynamic feedback.

---

## ⚡ Lighthouse Audit Scores

Optimized for web performance, accessibility standards, and modern front-end best practices:

| Metric | Score | Status |
| :--- | :---: | :--- |
| ⚡ **Performance** | **97 / 100** | 🟢 Excellent |
| ♿ **Accessibility** | **95 / 100** | 🟢 Excellent |
| ✅ **Best Practices** | **100 / 100** | 🟢 Perfect |
| 🔍 **SEO** | **91 / 100** | 🟢 Excellent |

---

## ✨ Key Features

* **📱 Fully Responsive Grid System:** Fluid design system that scales smoothly from smartphones to widescreen desktop displays.
* **🛡️ Defensive Input Validation:** Handles empty payloads, alphabetic characters, and mathematically impossible physical values with friendly user micro-copy.
* **🎨 Dynamic Visual Cues:** Injects context-aware UI color schemes depending on the calculated health category (Underweight, Normal weight, Overweight, Obese).
* **⚡ Smooth Animations:** Uses dynamic CSS transforms to seamlessly animate output scores and health indicators without layout shifts.
* **🚀 Zero Build Step:** Lightweight architecture running pure modern Vanilla JS and CDN-based Tailwind CSS—no heavy node modules or bundlers needed.

---

## 🎯 BMI Health Categories Reference

The application calculates score metrics using standard World Health Organization (WHO) ranges:

| BMI Range (kg/m²) | Health Category | Visual Indicator |
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
[![Built With HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

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

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/RaHuLxDeV1201/bmi-calculator.git](https://github.com/RaHuLxDeV1201/bmi-calculator.git)
   ```

2. **Navigate into the project directory:**
   ```bash
   cd bmi-calculator
   ```

3. **Launch the app:**
   * **Direct:** Double-click `index.html` to open it in your browser.
   * **Live Server (VS Code):** Right-click `index.html` and select **"Open with Live Server"**.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [Issues page](https://github.com/RaHuLxDeV1201/bmi-calculator/issues) if you want to report a bug or request a feature.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Crafted by <a href="https://github.com/RaHuLxDeV1201">Rahul Dev</a>
</p>
