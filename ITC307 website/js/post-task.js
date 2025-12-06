// Post Task Page JavaScript

let currentStep = 1;
const totalSteps = 4;

// Initialize post task page
document.addEventListener('DOMContentLoaded', function() {
    initializePostTask();
});

function initializePostTask() {
    setupEventListeners();
    setMinimumDate();
    updateProgressBar();
}

function setupEventListeners() {
    // Budget type change
    document.getElementById('budgetType').addEventListener('change', handleBudgetTypeChange);
    
    // Form submission
    document.getElementById('postTaskForm').addEventListener('submit', handleFormSubmission);
    
    // Step indicators
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        indicator.addEventListener('click', function() {
            const step = parseInt(this.getAttribute('data-step'));
            if (step < currentStep) {
                goToStep(step);
            }
        });
    });
}

function setMinimumDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('taskDeadline').setAttribute('min', today);
}

function handleBudgetTypeChange() {
    const budgetType = document.getElementById('budgetType').value;
    const fixedPriceInput = document.getElementById('fixedPriceInput');
    const rangeInputs = document.getElementById('rangeInputs');
    const maxAmountInput = document.getElementById('maxAmountInput');
    
    // Hide all budget inputs
    fixedPriceInput.style.display = 'none';
    rangeInputs.style.display = 'none';
    maxAmountInput.style.display = 'none';
    
    // Show relevant inputs based on type
    switch (budgetType) {
        case 'fixed':
            fixedPriceInput.style.display = 'block';
            break;
        case 'range':
            rangeInputs.style.display = 'block';
            maxAmountInput.style.display = 'block';
            break;
        case 'negotiable':
            // No additional inputs needed
            break;
    }
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
            updateProgressBar();
            updateNavigationButtons();
            
            // Update review section if on last step
            if (currentStep === totalSteps) {
                updateReviewSection();
            }
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgressBar();
        updateNavigationButtons();
    }
}

function goToStep(step) {
    if (step >= 1 && step <= totalSteps) {
        currentStep = step;
        showStep(currentStep);
        updateProgressBar();
        updateNavigationButtons();
        
        if (currentStep === totalSteps) {
            updateReviewSection();
        }
    }
}

function showStep(step) {
    // Hide all step content
    for (let i = 1; i <= totalSteps; i++) {
        document.getElementById(`step${i}`).style.display = 'none';
    }
    
    // Show current step
    document.getElementById(`step${step}`).style.display = 'block';
    
    // Update step indicators
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        const stepNumber = index + 1;
        indicator.classList.remove('active', 'completed');
        
        if (stepNumber === step) {
            indicator.classList.add('active');
        } else if (stepNumber < step) {
            indicator.classList.add('completed');
        }
    });
}

function updateProgressBar() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Show/hide previous button
    if (currentStep > 1) {
        prevBtn.style.display = 'block';
    } else {
        prevBtn.style.display = 'none';
    }
    
    // Show/hide next and submit buttons
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

function validateCurrentStep() {
    const requiredFields = getRequiredFieldsForStep(currentStep);
    let isValid = true;
    
    // Clear previous error messages
    clearErrorMessages();
    
    // Validate required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            showFieldError(fieldId, 'This field is required');
            isValid = false;
        }
    });
    
    // Step-specific validation
    switch (currentStep) {
        case 1:
            isValid = validateStep1() && isValid;
            break;
        case 2:
            isValid = validateStep2() && isValid;
            break;
        case 3:
            isValid = validateStep3() && isValid;
            break;
        case 4:
            isValid = validateStep4() && isValid;
            break;
    }
    
    return isValid;
}

function getRequiredFieldsForStep(step) {
    switch (step) {
        case 1:
            return ['taskTitle', 'taskCategory', 'taskDescription'];
        case 2:
            return ['budgetType', 'taskDeadline'];
        case 3:
            return ['taskLocation'];
        case 4:
            return ['agreeTerms'];
        default:
            return [];
    }
}

function validateStep1() {
    let isValid = true;
    
    // Validate title length
    const title = document.getElementById('taskTitle').value;
    if (title.length < 10) {
        showFieldError('taskTitle', 'Title must be at least 10 characters long');
        isValid = false;
    }
    
    // Validate description length
    const description = document.getElementById('taskDescription').value;
    if (description.length < 20) {
        showFieldError('taskDescription', 'Description must be at least 20 characters long');
        isValid = false;
    }
    
    return isValid;
}

function validateStep2() {
    let isValid = true;
    
    const budgetType = document.getElementById('budgetType').value;
    
    // Validate budget inputs based on type
    switch (budgetType) {
        case 'fixed':
            const fixedAmount = document.getElementById('fixedAmount').value;
            if (!fixedAmount || fixedAmount <= 0) {
                showFieldError('fixedAmount', 'Please enter a valid amount');
                isValid = false;
            }
            break;
        case 'range':
            const minAmount = document.getElementById('minAmount').value;
            const maxAmount = document.getElementById('maxAmount').value;
            
            if (!minAmount || minAmount <= 0) {
                showFieldError('minAmount', 'Please enter a valid minimum amount');
                isValid = false;
            }
            
            if (!maxAmount || maxAmount <= 0) {
                showFieldError('maxAmount', 'Please enter a valid maximum amount');
                isValid = false;
            }
            
            if (minAmount && maxAmount && parseFloat(minAmount) >= parseFloat(maxAmount)) {
                showFieldError('maxAmount', 'Maximum amount must be greater than minimum amount');
                isValid = false;
            }
            break;
    }
    
    // Validate deadline
    const deadline = document.getElementById('taskDeadline').value;
    if (deadline) {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (deadlineDate < today) {
            showFieldError('taskDeadline', 'Deadline cannot be in the past');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateStep3() {
    let isValid = true;
    
    // Validate email if provided
    const email = document.getElementById('contactEmail').value;
    if (email && !isValidEmail(email)) {
        showFieldError('contactEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone if provided
    const phone = document.getElementById('contactPhone').value;
    if (phone && !isValidPhone(phone)) {
        showFieldError('contactPhone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateStep4() {
    let isValid = true;
    
    // Validate terms agreement
    const agreeTerms = document.getElementById('agreeTerms').checked;
    if (!agreeTerms) {
        showFieldError('agreeTerms', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
    return phoneRegex.test(phone);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-danger mt-1';
    errorDiv.id = `${fieldId}Error`;
    errorDiv.textContent = message;
    
    field.classList.add('is-invalid');
    field.parentNode.appendChild(errorDiv);
}

function clearErrorMessages() {
    // Remove all error messages
    document.querySelectorAll('.text-danger').forEach(error => {
        if (error.id && error.id.endsWith('Error')) {
            error.remove();
        }
    });
    
    // Remove invalid class from fields
    document.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });
}

function updateReviewSection() {
    // Update task summary in review section
    document.getElementById('reviewTitle').textContent = document.getElementById('taskTitle').value;
    document.getElementById('reviewDescription').textContent = document.getElementById('taskDescription').value;
    document.getElementById('reviewCategory').textContent = document.getElementById('taskCategory').value;
    document.getElementById('reviewLocation').textContent = document.getElementById('taskLocation').value;
    
    // Update budget display
    const budgetType = document.getElementById('budgetType').value;
    let budgetText = '';
    
    switch (budgetType) {
        case 'fixed':
            budgetText = `$${document.getElementById('fixedAmount').value}`;
            break;
        case 'range':
            const min = document.getElementById('minAmount').value;
            const max = document.getElementById('maxAmount').value;
            budgetText = `$${min} - $${max}`;
            break;
        case 'negotiable':
            budgetText = 'Negotiable';
            break;
    }
    
    document.getElementById('reviewBudget').textContent = budgetText;
    
    // Update deadline
    const deadline = document.getElementById('taskDeadline').value;
    if (deadline) {
        const deadlineDate = new Date(deadline);
        document.getElementById('reviewDeadline').textContent = deadlineDate.toLocaleDateString('en-FJ');
    }
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    // Collect form data
    const formData = collectFormData();
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Posting Task...';
    submitBtn.disabled = true;
    
    try {
        // Post the task
        const newTask = await window.FijiTaskApp.postTask(formData);
        
        // Show success message
        window.FijiTaskApp.showNotification('Task posted successfully!', 'success');
        
        // Redirect to task detail page
        setTimeout(() => {
            window.location.href = `task-detail.html?id=${newTask.id}`;
        }, 1500);
        
    } catch (error) {
        console.error('Error posting task:', error);
        window.FijiTaskApp.showNotification('Error posting task. Please try again.', 'danger');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function collectFormData() {
    const budgetType = document.getElementById('budgetType').value;
    let budget = '';
    
    switch (budgetType) {
        case 'fixed':
            budget = `$${document.getElementById('fixedAmount').value}`;
            break;
        case 'range':
            const min = document.getElementById('minAmount').value;
            const max = document.getElementById('maxAmount').value;
            budget = `$${min}-${max}`;
            break;
        case 'negotiable':
            budget = 'Negotiable';
            break;
    }
    
    return {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        category: document.getElementById('taskCategory').value,
        budget: budget,
        location: document.getElementById('taskLocation').value,
        deadline: document.getElementById('taskDeadline').value,
        skills: document.getElementById('taskSkills').value,
        duration: document.getElementById('taskDuration').value,
        urgencyLevel: document.getElementById('urgencyLevel').value,
        specificAddress: document.getElementById('specificAddress').value,
        contactPhone: document.getElementById('contactPhone').value,
        contactEmail: document.getElementById('contactEmail').value,
        showContactInfo: document.getElementById('showContactInfo').checked,
        visibility: document.getElementById('taskVisibility').value,
        autoAccept: document.getElementById('autoAccept').value,
        currency: document.getElementById('budgetCurrency').value
    };
}

// Add CSS for step indicators
const style = document.createElement('style');
style.textContent = `
    .step-indicator {
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .step-indicator.active {
        background-color: var(--primary-color);
        color: white;
    }
    
    .step-indicator.completed {
        background-color: var(--success-color);
        color: white;
    }
    
    .step-indicator:hover:not(.active):not(.completed) {
        background-color: var(--gray-200);
    }
`;
document.head.appendChild(style);
