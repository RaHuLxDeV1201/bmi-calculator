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

    /* ==========================================================================
       1. BULLETPROOF DARK MODE TOGGLE ENGINE
       ========================================================================== */
    let isDark = false;

    // Safe wrapper: If the browser blocks localStorage locally, fallback gracefully
    try {
        isDark = localStorage.getItem('theme') === 'dark' || 
                 (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (error) {
        // If localStorage fails, use the user's system device preferences instead
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Initial theme application
    if (isDark) {
        document.documentElement.classList.add('dark');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }

    // Click Event Listener
    darkModeToggle.addEventListener('click', () => {
        // .toggle() automatically adds the class if missing, or removes it if present
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
       2. REUSABLE ERROR + SHAKE SYSTEM
       ========================================================================== */
    const showError = (inputEl, errorEl, message) => {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');

        // Clear out any existing animation classes first
        inputEl.classList.remove('animate-shake');
        
        // Force a DOM reflow calculation to reset the animation state completely
        void inputEl.offsetWidth; 

        // Apply error borders and trigger the fresh shake animation
        inputEl.classList.add('border-rose-300', 'focus:ring-rose-500', 'animate-shake');

        // Strip the animation class when done so it clears cleanly
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

        // Flush out styling templates to avoid theme coloring conflicts
        resultCard.className = 'mt-8 p-5 rounded-xl text-center animate-result';
        resultCard.classList.add(themeClass);

        bmiValueDisplay.textContent = bmi.toFixed(2);
        bmiCategoryDisplay.textContent = category;

        // Calculate the horizontal placement percentage for your slider bar.
        let sliderPercentage = ((bmi - 15) / (40 - 15)) * 100;
        
        // Clamp bounds to prevent the dot pointer from jumping off the layout edge
        if (sliderPercentage < 0) sliderPercentage = 0;
        if (sliderPercentage > 100) sliderPercentage = 100;
        
        // Move the visual gauge pointer smoothly
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
        heightInput.classList.remove('border-rose-300', 'focus:ring-rose-500', 'animate-shake');
        weightInput.classList.remove('border-rose-300', 'focus:ring-rose-500', 'animate-shake');
        resultCard.classList.add('hidden');
        bmiPointer.style.left = '0%'; // Reset the visual dot pointer
    });
});


// Clear error visual wrappers dynamically as the user types
[heightInput, weightInput, heightFtInput, heightInInput, weightLbsInput].forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('border-rose-300', 'focus:ring-rose-500', 'animate-shake');
        // Hide the respective text block if it exists
        if (input === heightInput || input === weightInput) {
            heightError.classList.add('hidden');
            weightError.classList.add('hidden');
        } else {
            imperialHeightError.classList.add('hidden');
            weightLbsError.classList.add('hidden');
        }
    });
    // Clear error visual styles instantly when the user modifies or clears the text fields
[heightInput, weightInput, heightFtInput, heightInInput, weightLbsInput].forEach(input => {
    input.addEventListener('input', () => {
        // Strip away the red error borders and focus rings
        input.classList.remove('border-rose-300', 'focus:ring-rose-500', 'animate-shake');
        
        // Hide the respective error message text element
        if (input === heightInput) {
            heightError.classList.add('hidden');
        } else if (input === weightInput) {
            weightError.classList.add('hidden');
        } else if (input === heightFtInput || input === heightInInput) {
            imperialHeightError.classList.add('hidden');
        } else if (input === weightLbsInput) {
            weightLbsError.classList.add('hidden');
        }
    });
});
});