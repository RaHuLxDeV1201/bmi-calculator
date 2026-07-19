document.addEventListener('DOMContentLoaded', () => {
    // Core Layout Hooks
    const bmiForm = document.getElementById('bmiForm');
    const resetBtn = document.getElementById('resetBtn');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const heightError = document.getElementById('heightError');
    const weightError = document.getElementById('weightError');
    const resultCard = document.getElementById('resultCard');
    const bmiValueDisplay = document.getElementById('bmiValue');
    const bmiCategoryDisplay = document.getElementById('bmiCategory');

    // Advanced UI Hooks
    const bmiPointer = document.getElementById('bmiPointer');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');

    // Imperial UI Hooks (Safely added to prevent reference errors)
    const heightFtInput = document.getElementById('heightFt');
    const heightInInput = document.getElementById('heightIn');
    const weightLbsInput = document.getElementById('weightLbs');
    const imperialHeightError = document.getElementById('imperialHeightError');
    const weightLbsError = document.getElementById('weightLbsError');

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
            try { localStorage.setItem('theme', 'dark'); } catch (e) { }
        } else {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
            try { localStorage.setItem('theme', 'light'); } catch (e) { }
        }
    });

    /* ==========================================================================
       2. REUSABLE ERROR + SHAKE SYSTEM
       ========================================================================== */
    const showError = (inputEl, errorEl, message) => {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');

        inputEl.classList.remove('animate-shake');
        void inputEl.offsetWidth; // Force a DOM reflow calculation

        inputEl.classList.add('border-rose-300', 'focus:ring-rose-500', 'animate-shake');

        inputEl.addEventListener('animationend', () => {
            inputEl.classList.remove('animate-shake');
        }, { once: true });
    };

    /* ==========================================================================
       3. INPUT VALIDATOR
       ========================================================================== */
    const validateInputs = (height, weight) => {
        let isValid = true;

        // Reset visual error layout states
        heightError.classList.add('hidden');
        weightError.classList.add('hidden');
        heightInput.classList.remove('border-rose-300', 'focus:ring-rose-500', 'animate-shake');
        weightInput.classList.remove('border-rose-300', 'focus:ring-rose-500', 'animate-shake');

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

    /* ==========================================================================
       4. FORM SUBMISSION INTERCEPTOR
       ========================================================================== */
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

    /* ==========================================================================
       5. DYNAMIC RESULT CARD & SLIDER ENGINE
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
       6. APP MASTER RESET
       ========================================================================== */
    resetBtn.addEventListener('click', () => {
        bmiForm.reset();
        heightError.classList.add('hidden');
        weightError.classList.add('hidden');
        if (imperialHeightError) imperialHeightError.classList.add('hidden');
        if (weightLbsError) weightLbsError.classList.add('hidden');
        
        heightInput.classList.remove('border-rose-300', 'focus:ring-rose-500', 'animate-shake');
        weightInput.classList.remove('border-rose-300', 'focus:ring-rose-500', 'animate-shake');
        resultCard.classList.add('hidden');
        bmiPointer.style.left = '0%';
    });

    /* ==========================================================================
       7. REAL-TIME ERROR CLEANUP ENGINE
       ========================================================================== */
    // .filter(Boolean) ensures the script won't crash if Imperial inputs aren't active in the HTML yet
    const inputFields = [heightInput, weightInput, heightFtInput, heightInInput, weightLbsInput].filter(Boolean);

    inputFields.forEach(input => {
        input.addEventListener('input', () => {
            // Strip red lines instantly when typing or clearing text
            input.classList.remove('border-rose-300', 'focus:ring-rose-500', 'animate-shake');

            // Safely hide corresponding text blocks if they exist in DOM
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