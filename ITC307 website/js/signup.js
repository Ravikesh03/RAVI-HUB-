// Signup Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeSignup();
});

function initializeSignup() {
    setupEventListeners();
    setupAccountTypeToggle();
}

function setupEventListeners() {
    // Form submission
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // Real-time validation
    document.getElementById('firstName').addEventListener('blur', validateFirstName);
    document.getElementById('lastName').addEventListener('blur', validateLastName);
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('phone').addEventListener('blur', validatePhone);
    document.getElementById('password').addEventListener('blur', validatePassword);
    document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);
    
    // Password strength indicator
    document.getElementById('password').addEventListener('input', checkPasswordStrength);
    
    // Account type change
    document.querySelectorAll('input[name="accountType"]').forEach(radio => {
        radio.addEventListener('change', toggleSkillsSection);
    });
}

function setupAccountTypeToggle() {
    // Show/hide skills section based on initial account type
    toggleSkillsSection();
}

function toggleSkillsSection() {
    const accountType = document.querySelector('input[name="accountType"]:checked').value;
    const skillsSection = document.getElementById('skillsSection');
    
    if (accountType === 'doer') {
        skillsSection.style.display = 'block';
        document.getElementById('skills').required = true;
    } else {
        skillsSection.style.display = 'none';
        document.getElementById('skills').required = false;
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = collectFormData();
    
    // Show loading state
    const submitBtn = document.querySelector('#signupForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Create user account
        const success = createUserAccount(formData);
        
        if (success) {
            // Show success message
            window.FijiTaskApp.showNotification('Account created successfully! Welcome to Fiji Task Marketplace.', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Show error message
            showFieldError('email', 'An account with this email already exists');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 2000);
}

function validateForm() {
    let isValid = true;
    
    // Validate all required fields
    if (!validateFirstName()) isValid = false;
    if (!validateLastName()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;
    if (!validateConfirmPassword()) isValid = false;
    
    // Validate optional fields if provided
    const phone = document.getElementById('phone').value;
    if (phone && !validatePhone()) isValid = false;
    
    // Validate skills if doer account
    const accountType = document.querySelector('input[name="accountType"]:checked').value;
    if (accountType === 'doer') {
        const skills = document.getElementById('skills').value.trim();
        if (!skills) {
            showFieldError('skills', 'Please describe your skills and expertise');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateFirstName() {
    const firstName = document.getElementById('firstName').value.trim();
    
    if (!firstName) {
        showFieldError('firstName', 'First name is required');
        return false;
    }
    
    if (firstName.length < 2) {
        showFieldError('firstName', 'First name must be at least 2 characters long');
        return false;
    }
    
    return true;
}

function validateLastName() {
    const lastName = document.getElementById('lastName').value.trim();
    
    if (!lastName) {
        showFieldError('lastName', 'Last name is required');
        return false;
    }
    
    if (lastName.length < 2) {
        showFieldError('lastName', 'Last name must be at least 2 characters long');
        return false;
    }
    
    return true;
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError('email', 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

function validatePhone() {
    const phone = document.getElementById('phone').value.trim();
    
    if (phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
        if (!phoneRegex.test(phone)) {
            showFieldError('phone', 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function validatePassword() {
    const password = document.getElementById('password').value;
    
    if (!password) {
        showFieldError('password', 'Password is required');
        return false;
    }
    
    if (password.length < 8) {
        showFieldError('password', 'Password must be at least 8 characters long');
        return false;
    }
    
    // Check for uppercase, lowercase, and numbers
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        showFieldError('password', 'Password must contain uppercase, lowercase, and numbers');
        return false;
    }
    
    return true;
}

function validateConfirmPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!confirmPassword) {
        showFieldError('confirmPassword', 'Please confirm your password');
        return false;
    }
    
    if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        return false;
    }
    
    return true;
}

function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (!strengthIndicator) {
        // Create strength indicator if it doesn't exist
        const passwordField = document.getElementById('password');
        const strengthDiv = document.createElement('div');
        strengthDiv.id = 'passwordStrength';
        strengthDiv.className = 'mt-2';
        passwordField.parentNode.appendChild(strengthDiv);
    }
    
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    switch (strength) {
        case 0:
        case 1:
            feedback = '<span class="text-danger">Very Weak</span>';
            break;
        case 2:
            feedback = '<span class="text-warning">Weak</span>';
            break;
        case 3:
            feedback = '<span class="text-info">Fair</span>';
            break;
        case 4:
            feedback = '<span class="text-primary">Good</span>';
            break;
        case 5:
            feedback = '<span class="text-success">Strong</span>';
            break;
    }
    
    document.getElementById('passwordStrength').innerHTML = `Password Strength: ${feedback}`;
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

function clearErrors() {
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

function collectFormData() {
    const accountType = document.querySelector('input[name="accountType"]:checked').value;
    
    return {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        location: document.getElementById('location').value,
        password: document.getElementById('password').value,
        accountType: accountType,
        skills: accountType === 'doer' ? document.getElementById('skills').value.trim() : '',
        newsletter: document.getElementById('newsletter').checked,
        agreeTerms: document.getElementById('agreeTerms').checked
    };
}

function createUserAccount(formData) {
    // Simulate user creation
    const user = {
        id: Date.now(),
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        accountType: formData.accountType,
        skills: formData.skills,
        rating: 0,
        completedTasks: 0,
        avatar: `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`,
        createdAt: new Date().toISOString()
    };
    
    // Store user in localStorage (in real app, this would be sent to server)
    localStorage.setItem('fijiTaskUser', JSON.stringify(user));
    
    // Update the global user object
    window.currentUser = user;
    
    return true;
}

function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggle');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordField.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

function socialSignup(provider) {
    // Show loading state
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="loading"></span> Connecting...';
    btn.disabled = true;
    
    // Simulate social signup
    setTimeout(() => {
        // In a real app, this would redirect to the social provider's OAuth page
        window.FijiTaskApp.showNotification(`${provider} signup is not implemented in this demo`, 'info');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

// Add some additional styling for the signup page
const style = document.createElement('style');
style.textContent = `
    .card {
        border: none;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .card-header {
        border-radius: 15px 15px 0 0 !important;
        border: none;
    }
    
    .form-control:focus {
        border-color: var(--success-color);
        box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
    }
    
    .btn {
        border-radius: 8px;
        font-weight: 500;
    }
    
    .btn-lg {
        padding: 0.75rem 1.5rem;
        font-size: 1.1rem;
    }
    
    .input-group-text {
        background-color: var(--gray-100);
        border-color: var(--gray-300);
    }
    
    .form-check-input:checked {
        background-color: var(--success-color);
        border-color: var(--success-color);
    }
    
    .text-decoration-none:hover {
        text-decoration: underline !important;
    }
    
    #passwordStrength {
        font-size: 0.875rem;
        font-weight: 500;
    }
`;
document.head.appendChild(style);
