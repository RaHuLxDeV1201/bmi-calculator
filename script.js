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

    // 1. The Reusable Error + Shake Micro-Interaction Function
    const showError = (inputEl, errorEl, message) => {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');

        // Add error colors and the shake modifier
        inputEl.classList.add('border-rose-300', 'focus:ring-rose-500', 'animate-shake');

        // Strip the shake class right after it finishes so it can shake again next time
        inputEl.addEventListener('animationend', () => {
            inputEl.classList.remove('animate-shake');
        }, { once: true });
    };

    // 2. Defensive Rule Input Validator
    const validateInputs = (height, weight) => {
        let isValid = true;

        // Reset state classes
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

    // 3. Form Submission Interceptor
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

    // 4. Dynamic Style Engine
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

        resultCard.classList.remove('hidden');
    };

    // 5. App State Master Reset
    resetBtn.addEventListener('click', () => {
        bmiForm.reset();
        heightError.classList.add('hidden');
        weightError.classList.add('hidden');
        heightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');
        weightInput.classList.remove('border-rose-300', 'focus:ring-rose-500');
        resultCard.classList.add('hidden');
    });
});