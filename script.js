document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. CORE DOM HOOKS
    // ==========================================================================
    const bmiForm = document.getElementById('bmiForm');
    const resetBtn = document.getElementById('resetBtn');
    const resultCard = document.getElementById('resultCard');
    const bmiValueDisplay = document.getElementById('bmiValue');
    const bmiCategoryDisplay = document.getElementById('bmiCategory');
    const bmiPointer = document.getElementById('bmiPointer');
    
    // Theme Handles
    const darkModeToggle = document.getElementById('darkModeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');

    // System Selection Handles
    const metricToggleBtn = document.getElementById('metricToggleBtn');
    const imperialToggleBtn = document.getElementById('imperialToggleBtn');
    const metricFields = document.getElementById('metricFields');
    const imperialFields = document.getElementById('imperialFields');

    // Inputs & Errors (Metric)
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const heightError = document.getElementById('heightError');
    const weightError = document.getElementById('weightError');

    // Inputs & Errors (Imperial)
    const heightFtInput = document.getElementById('heightFt');
    const heightInInput = document.getElementById('heightIn');
    const weightLbsInput = document.getElementById('weightLbs');
    const imperialHeightError = document.getElementById('imperialHeightError');
    const weightLbsError = document.getElementById('weightLbsError');

    // State Metric
    let currentUnit = 'metric'; 

    // ==========================================================================
    // 2. DARK MODE CORE ENGINE
    // ==========================================================================
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

    // ==========================================================================
    // 3. SEGMENTED UNIT SWITCH SYSTEM (PRO FIX)
    // ==========================================================================
    const setUnitSystem = (unit) => {
        if (currentUnit === unit) return;
        currentUnit = unit;

        clearValidation();
        if (resultCard) resultCard.classList.add('hidden');
        if (bmiPointer) bmiPointer.style.left = '0%';

        // Rewriting class names directly removes any active Tailwind conflicts safely
        const activeStyle = "flex-1 text-center py-2 text-xs sm:text-sm font-bold rounded-lg bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white transition-all duration-200";
        const inactiveStyle = "flex-1 text-center py-2 text-xs sm:text-sm font-bold rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all duration-200";

        if (currentUnit === 'metric') {
            if (metricToggleBtn) metricToggleBtn.className = activeStyle;
            if (imperialToggleBtn) imperialToggleBtn.className = inactiveStyle;
            if (metricFields) metricFields.classList.remove('hidden');
            if (imperialFields) imperialFields.classList.add('hidden');
        } else {
            if (imperialToggleBtn) imperialToggleBtn.className = activeStyle;
            if (metricToggleBtn) metricToggleBtn.className = inactiveStyle;
            if (imperialFields) imperialFields.classList.remove('hidden');
            if (metricFields) metricFields.classList.add('hidden');
        }
    };

    if (metricToggleBtn) metricToggleBtn.addEventListener('click', () => setUnitSystem('metric'));
    if (imperialToggleBtn) imperialToggleBtn.addEventListener('click', () => setUnitSystem('imperial'));

    // ==========================================================================
    // 4. ANIMATION & ERROR CLEARANCE VISUALIZERS
    // ==========================================================================
    const showError = (inputEl, errorEl, message) => {
        if (!inputEl || !errorEl) return;
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        
        inputEl.classList.remove('animate-shake', 'border-slate-200', 'dark:border-slate-600');
        void inputEl.offsetWidth; // Force Reflow
        
        inputEl.classList.add('border-rose-500', 'focus:ring-rose-500', 'animate-shake');

        inputEl.addEventListener('animationend', () => {
            inputEl.classList.remove('animate-shake');
        }, { once: true });
    };

    const clearValidation = () => {
        if (heightError) heightError.classList.add('hidden');
        if (weightError) weightError.classList.add('hidden');
        if (imperialHeightError) imperialHeightError.classList.add('hidden');
        if (weightLbsError) weightLbsError.classList.add('hidden');

        const inputs = [heightInput, weightInput, heightFtInput, heightInInput, weightLbsInput];
        inputs.forEach(input => {
            if (input) {
                input.classList.remove('border-rose-500', 'focus:ring-rose-500', 'animate-shake');
                input.classList.add('border-slate-200', 'dark:border-slate-600');
            }
        });
    };

    // ==========================================================================
    // 5. FORM INPUT VALIDATOR
    // ==========================================================================
    const validateInputs = () => {
        clearValidation();
        let isValid = true;

        if (currentUnit === 'metric') {
            const height = parseFloat(heightInput?.value);
            const weight = parseFloat(weightInput?.value);

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
            const ft = parseFloat(heightFtInput?.value);
            const inch = parseFloat(heightInInput?.value) || 0;
            const lbs = parseFloat(weightLbsInput?.value);

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

    // ==========================================================================
    // 6. PROCESSING & CALCULATIONS
    // ==========================================================================
    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateInputs()) {
                if (resultCard) resultCard.classList.add('hidden');
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
                
                const totalInches = (ft * 12) + inch;
                bmi = (lbs / (totalInches * totalInches)) * 703;
            }

            displayResult(bmi);
        });
    }

    const displayResult = (bmi) => {
        if (!resultCard || !bmiValueDisplay || !bmiCategoryDisplay) return;
        
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

        if (bmiPointer) {
            let sliderPercentage = ((bmi - 15) / (40 - 15)) * 100;
            if (sliderPercentage < 0) sliderPercentage = 0;
            if (sliderPercentage > 100) sliderPercentage = 100;
            bmiPointer.style.left = `${sliderPercentage}%`;
        }
        
        resultCard.classList.remove('hidden');
    };

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (bmiForm) bmiForm.reset();
            clearValidation();
            if (resultCard) resultCard.classList.add('hidden');
            if (bmiPointer) bmiPointer.style.left = '0%';
        });
    }

    // ==========================================================================
    // 7. SCOPED REAL-TIME REMOVAL ENGINE (BUGS FIXED)
    // ==========================================================================
    const inputsList = [heightInput, weightInput, heightFtInput, heightInInput, weightLbsInput];
    
    inputsList.forEach(input => {
        if (!input) return;

        input.addEventListener('input', () => {
            // Restore native outlines instantly on backspaces/deletes
            input.classList.remove('border-rose-500', 'focus:ring-rose-500', 'animate-shake');
            input.classList.add('border-slate-200', 'dark:border-slate-600');

            // Hide targeted tracking elements dynamically
            if (input === heightInput && heightError) {
                heightError.classList.add('hidden');
            } else if (input === weightInput && weightError) {
                weightError.classList.add('hidden');
            } else if ((input === heightFtInput || input === heightInInput) && imperialHeightError) {
                imperialHeightError.classList.add('hidden');
            } else if (input === weightLbsInput && weightLbsError) {
                weightLbsError.classList.add('hidden');
            }
        });
    });
});