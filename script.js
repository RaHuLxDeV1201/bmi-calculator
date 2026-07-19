document.addEventListener('DOMContentLoaded', () => {
    const bmiForm = document.getElementById('bmiForm');
    const resetBtn = document.getElementById('resetBtn');
    
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    
    const heightError = document.getElementById('heightError');
    const weightError = document.getElementById('weightError');
    
    const resultCard = document.getElementById('resultCard');
    const bmiValueDisplay = document.getElementById('bmiValue');
    const bmiCategoryDisplay = document.getElementById('bmiCategory');

    // Input Validation Blueprint
    const validateInputs = (height, weight) => {
        let isValid = true;

        // Reset previous errors
        heightError.classList.add('hidden');
        weightError.classList.add('hidden');
        heightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');
        weightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');

        // Validate Height Bounds (Realistic range: 50cm to 260cm)
        if (!height || isNaN(height)) {
            showError(heightInput, heightError, 'Height field cannot be left blank.');
            isValid = false;
        } else if (height < 50 || height > 260) {
            showError(heightInput, heightError, 'Please enter a realistic height between 50 and 260 cm.');
            isValid = false;
        }

        // Validate Weight Bounds (Realistic range: 2kg to 450kg)
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

    // Calculate Actions
    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if (!validateInputs(height, weight)) {
            resultCard.classList.add('hidden');
            return;
        }

        // Formula Implementation: weight (kg) / height (m)^2
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        displayResult(bmi);
    });

    // Strategy Pattern for Category Separation & UI Theme Mapping
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
        
        resultCard.classList.remove('hidden');
    };

    // Clear State Routine
    resetBtn.addEventListener('click', () => {
        bmiForm.reset();
        
        heightError.classList.add('hidden');
        weightError.classList.add('hidden');
        
        heightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');
        weightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');
        
        resultCard.classList.add('hidden');
    });
});