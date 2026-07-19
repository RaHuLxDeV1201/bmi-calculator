document.addEventListener('DOMContentLoaded', () => {
    // === 1. ELEMENT SELECTORS ===
    const bmiForm = document.getElementById('bmiForm');
    const resetBtn = document.getElementById('resetBtn');
    
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    
    const heightError = document.getElementById('heightError');
    const weightError = document.getElementById('weightError');
    
    const resultCard = document.getElementById('resultCard');
    const bmiValueDisplay = document.getElementById('bmiValue');
    const bmiCategoryDisplay = document.getElementById('bmiCategory');
    
    // NEW: Visual scale pointer selector linked to your HTML
    const bmiPointer = document.getElementById('bmiPointer');


    // === 2. VISUAL SCALE MATH ENGINE ===
    // Maps the calculated BMI value to a precise 0% - 100% horizontal position
    const calculatePointerPercentage = (bmi) => {
        let percentage = 0;

        if (bmi < 18.5) {
            // Map linearly between BMI 15 and 18.5 into the 0% - 25% quadrant
            percentage = ((bmi - 15) / (18.5 - 15)) * 25;
        } else if (bmi >= 18.5 && bmi < 25) {
            // Map linearly between BMI 18.5 and 25 into the 25% - 50% quadrant
            percentage = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
        } else if (bmi >= 25 && bmi < 30) {
            // Map linearly between BMI 25 and 30 into the 50% - 75% quadrant
            percentage = 50 + ((bmi - 25) / (30 - 25)) * 25;
        } else {
            // Map linearly between BMI 30 and 40 into the 75% - 100% quadrant
            percentage = 75 + ((bmi - 30) / (40 - 30)) * 25;
        }

        // Defensive clamping to keep the indicator dot from sliding off the slider graphic
        return Math.max(0, Math.min(100, percentage));
    };


    // === 3. INPUT VALIDATION ENGINE ===
    const validateInputs = (height, weight) => {
        let isValid = true;

        // Reset previous errors
        heightError.classList.add('hidden');
        weightError.classList.add('hidden');
        heightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');
        weightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');

        // Validate Height Bounds
        if (!height || isNaN(height)) {
            showError(heightInput, heightError, 'Height field cannot be left blank.');
            isValid = false;
        } else if (height < 50 || height > 260) {
            showError(heightInput, heightError, 'Please enter a realistic height between 50 and 260 cm.');
            isValid = false;
        }

        // Validate Weight Bounds
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


    // === 4. FORM EVENT SUBMISSION LISTENERS ===
    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if (!validateInputs(height, weight)) {
            resultCard.classList.add('hidden');
            return;
        }

        // Standard metric calculation
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        displayResult(bmi);
    });


    // === 5. DISPLAY GENERATION & UI INJECTIONS ===
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

        // Flush out previous themes mapping
        resultCard.className = 'mt-8 p-5 rounded-xl text-center animate-result';
        resultCard.classList.add(themeClass);

        // Populate visual text readouts
        bmiValueDisplay.textContent = bmi.toFixed(2);
        bmiCategoryDisplay.textContent = category;
        
        // NEW: Calculate percentage and smoothly slide the pointer dot using standard CSS positioning
        const pointerPercentage = calculatePointerPercentage(bmi);
        bmiPointer.style.left = `${pointerPercentage}%`;
        
        resultCard.classList.remove('hidden');
    };


    // === 6. STATE RESET ROUTINE ===
    resetBtn.addEventListener('click', () => {
        bmiForm.reset();
        
        heightError.classList.add('hidden');
        weightError.classList.add('hidden');
        
        heightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');
        weightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');
        
        // NEW: Instantly snap the indicator needle back to the far left position
        bmiPointer.style.left = '0%';
        
        resultCard.classList.add('hidden');
    });
});