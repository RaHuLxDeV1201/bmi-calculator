document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENT SELECTORS ===
    const bmiForm = document.getElementById('bmiForm');
    const resetBtn = document.getElementById('resetBtn');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const heightError = document.getElementById('heightError');
    const weightError = document.getElementById('weightError');
    const resultCard = document.getElementById('resultCard');
    const bmiValueDisplay = document.getElementById('bmiValue');
    const bmiCategoryDisplay = document.getElementById('bmiCategory');
    const bmiPointer = document.getElementById('bmiPointer');

    // NEW: Dark Mode Selectors
    const darkModeToggle = document.getElementById('darkModeToggle');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    // === NEW: DARK MODE SYSTEM INITIALIZATION ===
    // Check local storage or system preference to default setup
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }

    darkModeToggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    });

    // === VISUAL SCALE MATH ENGINE ===
    const calculatePointerPercentage = (bmi) => {
        let percentage = 0;
        if (bmi < 18.5) {
            percentage = ((bmi - 15) / (18.5 - 15)) * 25;
        } else if (bmi >= 18.5 && bmi < 25) {
            percentage = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
        } else if (bmi >= 25 && bmi < 30) {
            percentage = 50 + ((bmi - 25) / (30 - 25)) * 25;
        } else {
            percentage = 75 + ((bmi - 30) / (40 - 30)) * 25;
        }
        return Math.max(0, Math.min(100, percentage));
    };

    // === INPUT VALIDATION ENGINE ===
    const validateInputs = (height, weight) => {
        let isValid = true;
        heightError.classList.add('hidden');
        weightError.classList.add('hidden');
        heightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');
        weightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');

        if (!height || isNaN(height)) {
            showError(heightInput, heightError, 'Height field cannot be left blank.');
            isValid = false;
        } else if (height < 50 || height > 260) {
            showError(heightInput, heightError, 'Please enter a realistic height between 50 and 260 cm.');
            isValid = false;
        }

        if (!weight || isNaN(weight)) {
            showError(weightInput, weightError, 'Weight field cannot be left blank.');
            isValid = false;
        } else if (weight < 2 || weight > 450) {
            showError(weightInput, weightError, 'Please enter a realistic weight between 2 and 450 kg.');
            isValid = false;
        }
        return isValid;
    };

    const showError = (inputEl, errorEl, message) => {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        inputEl.classList.add('border-rose-300', 'focus:ring-rose-500');
    };

    // === FORM EVENT SUBMISSION LISTENER ===
    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if (!validateInputs(height, weight)) {
            resultCard.classList.add('hidden');
            return;
        }

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        displayResult(bmi);
    });

    // === DISPLAY GENERATION & UI INJECTIONS ===
    const displayResult = (bmi) => {
        let category = '';
        let themeClass = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            themeClass = 'theme-underweight';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = 'Normal Weight';
            themeClass = 'theme-normal';
        } else if (bmi >= 25.0 && bmi <= 29.9) {
            category = 'Overweight';
            themeClass = 'theme-overweight';
        } else {
            category = 'Obese';
            themeClass = 'theme-obese';
        }

        resultCard.className = 'mt-8 p-5 rounded-xl text-center animate-result';
        resultCard.classList.add(themeClass);

        bmiValueDisplay.textContent = bmi.toFixed(2);
        bmiCategoryDisplay.textContent = category;
        
        const pointerPercentage = calculatePointerPercentage(bmi);
        bmiPointer.style.left = `${pointerPercentage}%`;
        
        resultCard.classList.remove('hidden');
    };

    // === STATE RESET ROUTINE ===
    resetBtn.addEventListener('click', () => {
        bmiForm.reset();
        heightError.classList.add('hidden');
        weightError.classList.add('hidden');
        heightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');
        weightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');
        bmiPointer.style.left = '0%';
        resultCard.classList.add('hidden');
    });
});