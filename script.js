// Wait for the HTML document to be fully parsed and loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DOM Element References
    

    // Main form and result display elements
    const bmiForm = document.getElementById('bmiForm');
    const resetBtn = document.getElementById('resetBtn');
    const resultCard = document.getElementById('resultCard');
    const bmiValueDisplay = document.getElementById('bmiValue');
    const bmiCategoryDisplay = document.getElementById('bmiCategory');
    const bmiPointer = document.getElementById('bmiPointer');
    const healthyInsight = document.getElementById('healthyInsight');

    // Theme toggle elements (Dark/Light mode)
    const darkModeToggle = document.getElementById('darkModeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');

    // Unit toggle buttons and container panels
    const metricToggleBtn = document.getElementById('metricToggleBtn');
    const imperialToggleBtn = document.getElementById('imperialToggleBtn');
    const metricFields = document.getElementById('metricFields');
    const imperialFields = document.getElementById('imperialFields');

    // Metric input fields and error messages
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const heightError = document.getElementById('heightError');
    const weightError = document.getElementById('weightError');

    // Imperial input fields and error messages
    const heightFtInput = document.getElementById('heightFt');
    const heightInInput = document.getElementById('heightIn');
    const weightLbsInput = document.getElementById('weightLbs');
    const imperialHeightError = document.getElementById('imperialHeightError');
    const weightLbsError = document.getElementById('weightLbsError');

    // History log UI components
    const historyToggleBtn = document.getElementById('historyToggleBtn');
    const historyChevron = document.getElementById('historyChevron');
    const historyContent = document.getElementById('historyContent');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Application state for unit tracking
    let currentUnit = 'metric';

    
    // 2. Dark Mode Engine Logic
    

    let isDark = false;

    // Check localStorage for saved theme preference; fallback to system preference if none exists
    try {
        isDark = localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) {
        // Fallback for strict browser settings blocking localStorage
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Apply initial theme classes to the document root and toggle icons
    if (isDark) {
        document.documentElement.classList.add('dark');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }

    // Handle manual toggling of the dark mode theme
    darkModeToggle.addEventListener('click', () => {
        const isNowDark = document.documentElement.classList.toggle('dark');

        // Update icons and save preference to localStorage
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

    
    // 3. Unit Transition Core (Metric/Imperial)
    

    const setUnitSystem = (unit) => {
        // Prevent unnecessary updates if the same unit is clicked
        if (currentUnit === unit) return;
        currentUnit = unit;

        // Reset form state when switching units
        clearValidation();
        if (resultCard) resultCard.classList.add('hidden');
        if (bmiPointer) bmiPointer.style.left = '0%';

        // Define styling classes for active and inactive button states
        const activeStyle = "flex-1 text-center py-2 text-xs sm:text-sm font-bold rounded-lg bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white transition-all duration-200";
        const inactiveStyle = "flex-1 text-center py-2 text-xs sm:text-sm font-bold rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all duration-200";

        // Swap visible fields and update button styling based on selected unit
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

    // Attach click listeners to unit toggle buttons
    if (metricToggleBtn) metricToggleBtn.addEventListener('click', () => setUnitSystem('metric'));
    if (imperialToggleBtn) imperialToggleBtn.addEventListener('click', () => setUnitSystem('imperial'));

    
    // 4. Input Validation & Error Handling
    

    // Displays an error message and triggers a CSS shake animation on the invalid input
    const showError = (inputEl, errorEl, message) => {
        if (!inputEl || !errorEl) return;
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');

        // Reset animation state to allow re-triggering the shake effect
        inputEl.classList.remove('animate-shake', 'border-slate-200', 'dark:border-slate-600');
        void inputEl.offsetWidth; // Trigger DOM reflow
        inputEl.classList.add('border-rose-500', 'focus:ring-rose-500', 'animate-shake');

        // Remove animation class after it completes
        inputEl.addEventListener('animationend', () => inputEl.classList.remove('animate-shake'), { once: true });
    };

    // Clears all existing error messages and resets input border colors
    const clearValidation = () => {
        if (heightError) heightError.classList.add('hidden');
        if (weightError) weightError.classList.add('hidden');
        if (imperialHeightError) imperialHeightError.classList.add('hidden');
        if (weightLbsError) weightLbsError.classList.add('hidden');

        [heightInput, weightInput, heightFtInput, heightInInput, weightLbsInput].forEach(input => {
            if (input) {
                input.classList.remove('border-rose-500', 'focus:ring-rose-500', 'animate-shake');
                input.classList.add('border-slate-200', 'dark:border-slate-600');
            }
        });
    };

    // Validates inputs based on the currently selected unit system
    const validateInputs = () => {
        clearValidation();
        let isValid = true;

        if (currentUnit === 'metric') {
            const height = parseFloat(heightInput?.value);
            const weight = parseFloat(weightInput?.value);

            // Check metric boundaries
            if (!height || isNaN(height) || height < 50 || height > 260) {
                showError(heightInput, heightError, 'Please enter a height between 50 and 260 cm.');
                isValid = false;
            }
            if (!weight || isNaN(weight) || weight < 2 || weight > 450) {
                showError(weightInput, weightError, 'Please enter a weight between 2 and 450 kg.');
                isValid = false;
            }
        } else {
            const ft = parseFloat(heightFtInput?.value);
            const inch = parseFloat(heightInInput?.value) || 0; // Inches can be 0 or empty
            const lbs = parseFloat(weightLbsInput?.value);

            // Check imperial boundaries
            if (!ft || isNaN(ft) || ft < 1 || ft > 8 || isNaN(inch) || inch < 0 || inch >= 12) {
                showError(heightFtInput, imperialHeightError, 'Enter a valid height (1-8 ft, 0-11 in).');
                isValid = false;
            }
            if (!lbs || isNaN(lbs) || lbs < 5 || lbs > 1000) {
                showError(weightLbsInput, weightLbsError, 'Please enter a weight between 5 and 1000 lbs.');
                isValid = false;
            }
        }
        return isValid;
    };

    
    // 5. Form Processing Engine (Calculation)
    

    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page refresh on submit

            // Abort calculation if validation fails
            if (!validateInputs()) {
                if (resultCard) resultCard.classList.add('hidden');
                return;
            }

            let bmi = 0;

            // Calculate BMI using the appropriate formula
            if (currentUnit === 'metric') {
                const heightM = parseFloat(heightInput.value) / 100; // Convert cm to meters
                bmi = parseFloat(weightInput.value) / (heightM * heightM);
            } else {
                const totalInches = (parseFloat(heightFtInput.value) * 12) + (parseFloat(heightInInput.value) || 0);
                bmi = (parseFloat(weightLbsInput.value) / (totalInches * totalInches)) * 703;
            }

            // Render results to screen and save to local history
            displayResult(bmi);
            saveHistoryLog(bmi);
        });
    }

    
    // 6. Displaying Results & Health Insights
    

    const displayResult = (bmi) => {
        if (!resultCard || !bmiValueDisplay || !bmiCategoryDisplay || !healthyInsight) return;
        let category = '', themeClass = '';

        // Determine BMI category and color theme
        if (bmi < 18.5) { category = 'Underweight'; themeClass = 'theme-underweight'; }
        else if (bmi < 25.0) { category = 'Normal Weight'; themeClass = 'theme-normal'; }
        else if (bmi < 30.0) { category = 'Overweight'; themeClass = 'theme-overweight'; }
        else { category = 'Obese'; themeClass = 'theme-obese'; }

        // Apply theme and update primary result texts
        resultCard.className = 'mt-8 p-5 rounded-xl text-center animate-result ' + themeClass;
        bmiValueDisplay.textContent = bmi.toFixed(2);
        bmiCategoryDisplay.textContent = category;

        // Calculate dynamic healthy weight range based on user's height
        let minWeight = 0, maxWeight = 0, currentWeight = 0, unitLabel = '';

        if (currentUnit === 'metric') {
            const heightM = parseFloat(heightInput.value) / 100;
            currentWeight = parseFloat(weightInput.value);
            // Reverse engineer BMI formula for min/max healthy weights (BMI 18.5 to 24.9)
            minWeight = 18.5 * heightM * heightM;
            maxWeight = 24.9 * heightM * heightM;
            unitLabel = 'kg';
        } else {
            const totalInches = (parseFloat(heightFtInput.value) * 12) + (parseFloat(heightInInput.value) || 0);
            currentWeight = parseFloat(weightLbsInput.value);
            minWeight = (18.5 * totalInches * totalInches) / 703;
            maxWeight = (24.9 * totalInches * totalInches) / 703;
            unitLabel = 'lbs';
        }

        // Build Custom UX Text String providing actionable weight loss/gain insights
        if (bmi < 18.5) {
            const away = (minWeight - currentWeight).toFixed(1);
            healthyInsight.innerHTML = `To reach a normal BMI range, your target weight is between <strong>${minWeight.toFixed(1)} ${unitLabel}</strong> and <strong>${maxWeight.toFixed(1)} ${unitLabel}</strong> (you are currently <strong>${away} ${unitLabel} under</strong>).`;
        } else if (bmi >= 25.0) {
            const away = (currentWeight - maxWeight).toFixed(1);
            healthyInsight.innerHTML = `To reach a normal BMI range, your target weight is between <strong>${minWeight.toFixed(1)} ${unitLabel}</strong> and <strong>${maxWeight.toFixed(1)} ${unitLabel}</strong> (you are currently <strong>${away} ${unitLabel} away</strong>).`;
        } else {
            healthyInsight.innerHTML = `Great job! You are within a healthy BMI range. Your ideal weight range is between <strong>${minWeight.toFixed(1)} ${unitLabel}</strong> and <strong>${maxWeight.toFixed(1)} ${unitLabel}</strong>.`;
        }

        // Move the visual gauge pointer based on BMI (Assuming scale goes from BMI 15 to 40)
        if (bmiPointer) {
            let pct = ((bmi - 15) / (40 - 15)) * 100;
            // Clamp percentage between 0 and 100 to prevent pointer overflowing bounds
            bmiPointer.style.left = `${Math.max(0, Math.min(100, pct))}%`;
        }

        // Show the result card
        resultCard.classList.remove('hidden');
    };

    
    // 7. History Engine Logic
    

    // Retrieve BMI history array from localStorage safely
    const getHistory = () => {
        try {
            return JSON.parse(localStorage.getItem('bmiHistory')) || [];
        } catch (e) {
            return [];
        }
    };

    // Add a new calculation to the history log
    const saveHistoryLog = (bmi) => {
        const history = getHistory();
        let category = '';

        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25.0) category = 'Normal';
        else if (bmi < 30.0) category = 'Overweight';
        else category = 'Obese';

        const newEntry = {
            id: Date.now(), // Unique ID for key tracking
            bmi: bmi.toFixed(2),
            category: category,
            date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };

        // Add to front of array and keep only the latest 5 entries
        history.unshift(newEntry);
        if (history.length > 5) history.pop();

        try {
            localStorage.setItem('bmiHistory', JSON.stringify(history));
        } catch (e) { }

        renderHistory();
    };

    // Update the History UI with saved entries
    const renderHistory = () => {
        if (!historyList) return;
        const history = getHistory();

        // Handle empty state
        if (history.length === 0) {
            historyList.innerHTML = `<p class="text-xs text-center text-slate-400 dark:text-slate-500 py-3 font-medium">No calculation logs found.</p>`;
            if (clearHistoryBtn) {
                clearHistoryBtn.classList.add('hidden');
                clearHistoryBtn.style.setProperty('display', 'none', 'important');
            }
            return;
        }

        // Mapping categories to specific UI color schemes
        const categoryColors = {
            'Underweight': 'text-sky-500 bg-sky-50 dark:bg-sky-950/40',
            'Normal': 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
            'Overweight': 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
            'Obese': 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
        };

        // Generate HTML for each history entry
        historyList.innerHTML = history.map(item => `
            <div class="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/40 bg-slate-50/50 dark:bg-slate-900/30">
                <div class="flex items-center gap-3">
                    <span class="text-base font-black text-slate-700 dark:text-slate-200">${item.bmi}</span>
                    <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${categoryColors[item.category] || 'text-slate-500'}">
                        ${item.category}
                    </span>
                </div>
                <span class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">${item.date}</span>
            </div>
        `).join('');

        // Make clear button visible once there is history
        if (clearHistoryBtn) {
            clearHistoryBtn.classList.remove('hidden');
            clearHistoryBtn.style.setProperty('display', 'block', 'important');
        }
    };

    // Toggle expansion/collapse of the history log section
    if (historyToggleBtn && historyContent && historyChevron) {
        historyToggleBtn.addEventListener('click', () => {
            const isCurrentlyHidden = historyContent.classList.contains('hidden') || historyContent.style.display === 'none';

            if (isCurrentlyHidden) {
                historyContent.classList.remove('hidden');
                historyContent.style.display = 'block';
                historyChevron.style.transform = 'rotate(180deg)'; // Flip the arrow icon
                renderHistory();
            } else {
                historyContent.classList.add('hidden');
                historyContent.style.display = 'none';
                historyChevron.style.transform = 'rotate(0deg)'; // Reset the arrow icon
            }
        });
    }

    // Clear History Button Engine (Wipes localStorage and updates UI)
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                localStorage.setItem('bmiHistory', JSON.stringify([]));
            } catch (err) { }
            renderHistory(); // Re-render to show empty state
        });
    }

    // Initial render of history when page loads
    renderHistory();

    
    // 8. General Reset & User Input Listeners
    

    // Reset button logic: Clears the form, hides results, and resets visuals
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (bmiForm) bmiForm.reset();
            clearValidation();
            if (resultCard) resultCard.classList.add('hidden');
            if (bmiPointer) bmiPointer.style.left = '0%';
            if (healthyInsight) healthyInsight.textContent = '';
        });
    }

    // Real-Time Clear Error Listeners: Remove red borders/warnings as the user types
    [heightInput, weightInput, heightFtInput, heightInInput, weightLbsInput].forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
            // Remove error styling instantly
            input.classList.remove('border-rose-500', 'focus:ring-rose-500', 'animate-shake');
            input.classList.add('border-slate-200', 'dark:border-slate-600');

            // Hide the corresponding text error message
            if (input === heightInput && heightError) heightError.classList.add('hidden');
            else if (input === weightInput && weightError) weightError.classList.add('hidden');
            else if ((input === heightFtInput || input === heightInInput) && imperialHeightError) imperialHeightError.classList.add('hidden');
            else if (input === weightLbsInput && weightLbsError) weightLbsError.classList.add('hidden');
        });
    });
});