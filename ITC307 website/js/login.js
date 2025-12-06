// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
});

function initializeLogin() {
    setupEventListeners();
    checkRememberedUser();
}

function setupEventListeners() {
    // Form submission
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Real-time validation
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('password').addEventListener('blur', validatePassword);
    
    // Enter key submission
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Show loading state
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Signing In...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Attempt login
        const success = window.FijiTaskApp.login(email, password);
        
        if (success) {
            // Save remember me preference
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            // Show success message
            window.FijiTaskApp.showNotification('Login successful! Welcome back.', 'success');
            
            // Redirect to dashboard or previous page
            const redirectUrl = getRedirectUrl();
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        } else {
            // Show error message
            showFieldError('password', 'Invalid email or password');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
}

function validateForm() {
    let isValid = true;
    
    // Validate email
    if (!validateEmail()) {
        isValid = false;
    }
    
    // Validate password
    if (!validatePassword()) {
        isValid = false;
    }
    
    return isValid;
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

function validatePassword() {
    const password = document.getElementById('password').value;
    
    if (!password) {
        showFieldError('password', 'Password is required');
        return false;
    }
    
    if (password.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters long');
        return false;
    }
    
    return true;
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

function socialLogin(provider) {
    // Show loading state
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="loading"></span> Connecting...';
    btn.disabled = true;
    
    // Simulate social login
    setTimeout(() => {
        // In a real app, this would redirect to the social provider's OAuth page
        window.FijiTaskApp.showNotification(`${provider} login is not implemented in this demo`, 'info');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

function checkRememberedUser() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
}

function getRedirectUrl() {
    // Check for redirect parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect) {
        return decodeURIComponent(redirect);
    }
    
    // Default redirect to dashboard
    return 'dashboard.html';
}

// Add some additional styling for the login page
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
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
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
        background-color: var(--primary-color);
        border-color: var(--primary-color);
    }
    
    .text-decoration-none:hover {
        text-decoration: underline !important;
    }
`;
document.head.appendChild(style);
