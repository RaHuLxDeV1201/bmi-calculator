document.addEventListener('DOMContentLoaded', () => {
    // Core Layout Hooks
    const bmiForm = document.getElementById('bmiForm');
    const resetBtn = document.getElementById('resetBtn');
    const resultCard = document.getElementById('resultCard');
    const bmiValueDisplay = document.getElementById('bmiValue');
    const bmiCategoryDisplay = document.getElementById('bmiCategory');
    const bmiPointer = document.getElementById('bmiPointer');
    
    // Theme Hooks
    const darkModeToggle = document.getElementById('darkModeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');

    // NEW: Unit Switching System Hooks
    const metricToggleBtn = document.getElementById('metricToggleBtn');
    const imperialToggleBtn = document.getElementById('imperialToggleBtn');
    const metricFields = document.getElementById('metricFields');
    const imperialFields = document.getElementById('imperialFields');

    // Unit Input Hooks
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const heightError = document.getElementById('heightError');
    const weightError = document.getElementById('weightError');

    const heightFtInput = document.getElementById('heightFt');
    const heightInInput = document.getElementById('heightIn');
    const weightLbsInput = document.getElementById('weightLbs');
    const imperialHeightError = document.getElementById('imperialHeightError');
    const weightLbsError = document.getElementById('weightLbsError');

    // Core System State
    let currentUnit = 'metric'; // 'metric' or 'imperial'

    /* ==========================================================================
       1. BULLETPROOF DARK MODE TOGGLE ENGINE
       ========================================================================== */
    let isDark = false;
    try {
        isDark = localStorage.getItem('theme') === 'dark' || 
                 (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (error) {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
        document.documentElement.classList.add('dark');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }

    darkModeToggle.addEventListener('click', () => {
        const isNowDark = document.documentElement.classList.toggle('dark');
        if (isNowDark) {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
            try { localStorage.setItem('theme', 'dark'); } catch (e) {}
        } else {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
            try { localStorage.setItem('theme', 'light'); } catch (e) {}
        }
    });

    /* ==========================================================================
       2. NEW FEATURE: MEASUREMENT TOGGLE SYSTEM ENGINE
       ========================================================================== */
    const setUnitSystem = (unit) => {
        if (currentUnit === unit) return;
        currentUnit = unit;

        // Clear layout components and clean up error markers
        clearValidation();
        resultCard.classList.add('hidden');
        bmiPointer.style.left = '0%';

        const activeClasses = ['bg-white', 'dark:bg-slate-600', 'shadow-sm', 'text-slate-800', 'dark:text-white'];
        const inactiveClasses = ['text-slate-400', 'dark:text-slate-400', 'hover:text-slate-600', 'dark:hover:text-slate-200'];

        if (currentUnit === 'metric') {
            // Swap Button Styles
            metricToggleBtn.classList.add(...activeClasses);
            metricToggleBtn.classList.remove(...inactiveClasses);
            imperialToggleBtn.classList.remove(...activeClasses);
            imperialToggleBtn.classList.add(...inactiveClasses);

            // Swap Field Wrappers
            metricFields.classList.remove('hidden');
            imperialFields.classList.add('hidden');
        } else {
            // Swap Button Styles
            imperialToggleBtn.classList.add(...activeClasses);
            imperialToggleBtn.classList.remove(...inactiveClasses);
            metricToggleBtn.classList.remove(...activeClasses);
            metricToggleBtn.classList.add(...inactiveClasses);

            // Swap Field Wrappers
            imperialFields.classList.remove('hidden');
            metricFields.classList.add('hidden');
        }
    };

    metricToggleBtn.addEventListener('click', () => setUnitSystem('metric'));
    imperialToggleBtn.addEventListener('click', () => setUnitSystem('imperial'));

    /* ==========================================================================
       3. REUSABLE ERROR + SHAKE SYSTEM
       ========================================================================== */
    const showError = (inputEl, errorEl, message) => {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        inputEl.classList.remove('animate-shake');
        void inputEl.offsetWidth; // Force Reflow
        inputEl.classList.add('border-rose-300', 'focus:ring-rose-500', 'animate-shake');

        inputEl.addEventListener('animationend', () => {
            inputEl.classList.remove('animate-shake');
        }, { once: true });
    };

    const clearValidation = () => {
        // Hide error text blocks
        heightError.classList.add('hidden');
        weightError.classList.add('hidden');
        imperialHeightError.classList.add('hidden');
        weightLbsError.classList.add('hidden');

        // Reset input bounding outlines
        const inputs = [heightInput, weightInput, heightFtInput, heightInInput, weightLbsInput];
        inputs.forEach(input => {
            input.classList.remove('border-rose-300', 'focus:ring-rose-500', 'animate-shake');
        });
    };

    /* ==========================================================================
       4. INPUT VALIDATOR
       ========================================================================== */
    const validateInputs = () => {
        clearValidation();
        let isValid = true;

        if (currentUnit === 'metric') {
            const height = parseFloat(heightInput.value);
            const weight = parseFloat(weightInput.value);

            if (!height || isNaN(height)) {
                showError(heightInput, heightError, 'Height field cannot be left blank.');
                isValid = false;
            } else if (height < 50 || height > 260) {
                showError(heightInput, heightError, 'Please enter a height between 50 and 260 cm.');
                isValid = false;
            }

            if (!weight || isNaN(weight)) {
                showError(weightInput, weightError, 'Weight field cannot be left blank.');
                isValid = false;
            } else if (weight < 2 || weight > 450) {
                showError(weightInput, weightError, 'Please enter a weight between 2 and 450 kg.');
                isValid = false;
            }
        } else {
            // Validate Imperial Fields
            const ft = parseFloat(heightFtInput.value);
            const inch = parseFloat(heightInInput.value) || 0; // Fallback to 0 if text field left empty
            const lbs = parseFloat(weightLbsInput.value);

            if (!ft || isNaN(ft) || ft < 1 || ft > 8) {
                showError(heightFtInput, imperialHeightError, 'Enter a valid height (1-8 feet).');
                isValid = false;
            } else if (isNaN(inch) || inch < 0 || inch >= 12) {
                showError(heightInInput, imperialHeightError, 'Inches must be between 0 and 11.');
                isValid = false;
            }

            if (!lbs || isNaN(lbs)) {
                showError(weightLbsInput, weightLbsError, 'Weight field cannot be left blank.');
                isValid = false;
            } else if (lbs < 5 || lbs > 1000) {
                showError(weightLbsInput, weightLbsError, 'Please enter a weight between 5 and 1000 lbs.');
                isValid = false;
            }
        }

        return isValid;
    };

    /* ==========================================================================
       5. FORM SUBMISSION INTERCEPTOR
       ========================================================================== */
    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            resultCard.classList.add('hidden');
            return;
        }

        let bmi = 0;

        if (currentUnit === 'metric') {
            const height = parseFloat(heightInput.value);
            const weight = parseFloat(weightInput.value);
            const heightInMeters = height / 100;
            bmi = weight / (heightInMeters * heightInMeters);
        } else {
            const ft = parseFloat(heightFtInput.value);
            const inch = parseFloat(heightInInput.value) || 0;
            const lbs = parseFloat(weightLbsInput.value);
            
            // Convert everything into a standard total inches value
            const totalInches = (ft * 12) + inch;
            bmi = (lbs / (totalInches * totalInches)) * 703;
        }

        displayResult(bmi);
    });

    /* ==========================================================================
       6. DYNAMIC RESULT CARD & SLIDER ENGINE
       ========================================================================== */
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

        let sliderPercentage = ((bmi - 15) / (40 - 15)) * 100;
        if (sliderPercentage < 0) sliderPercentage = 0;
        if (sliderPercentage > 100) sliderPercentage = 100;
        
        bmiPointer.style.left = `${sliderPercentage}%`;
        resultCard.classList.remove('hidden');
    };

    /* ==========================================================================
       7. APP MASTER RESET
       ========================================================================== */
    resetBtn.addEventListener('click', () => {
        bmiForm.reset();
        clearValidation();
        resultCard.classList.add('hidden');
        bmiPointer.style.left = '0%';
    });
});