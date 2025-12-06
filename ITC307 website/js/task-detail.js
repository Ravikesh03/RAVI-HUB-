// Task Detail Page JavaScript

let currentTask = null;
let currentUser = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeTaskDetail();
});

function initializeTaskDetail() {
    // Check user session
    checkUserSession();
    
    // Get task ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    
    if (taskId) {
        loadTaskDetails(taskId);
    } else {
        showError('Task ID not found');
    }
}

function checkUserSession() {
    const savedUser = localStorage.getItem('fijiTaskUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateBidSection();
    } else {
        showLoginRequired();
    }
}

async function loadTaskDetails(taskId) {
    try {
        // Try to get tasks from Google Sheets first
        if (window.FijiTaskApp.GoogleSheetsAPI && window.FijiTaskApp.GoogleSheetsAPI.isGoogleSheetsAvailable) {
            const tasks = await window.FijiTaskApp.GoogleSheetsAPI.getTasks();
            currentTask = tasks.find(task => task.id == taskId);
        } else {
            // Fallback to local data
            currentTask = window.FijiTaskApp.sampleTasks.find(task => task.id == taskId);
        }
        
        if (currentTask) {
            displayTaskDetails(currentTask);
            loadSimilarTasks(currentTask);
        } else {
            showError('Task not found');
        }
    } catch (error) {
        console.error('Error loading task details:', error);
        // Fallback to local data
        currentTask = window.FijiTaskApp.sampleTasks.find(task => task.id == taskId);
        if (currentTask) {
            displayTaskDetails(currentTask);
            loadSimilarTasks(currentTask);
        } else {
            showError('Task not found');
        }
    }
}

function displayTaskDetails(task) {
    // Task Details Section
    const taskDetails = document.getElementById('taskDetails');
    taskDetails.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <h3 class="mb-3">${task.title}</h3>
                <div class="d-flex gap-3 mb-3">
                    <span class="badge bg-primary">${task.category}</span>
                    <span class="badge bg-success">${task.status}</span>
                </div>
            </div>
            <div class="col-md-4 text-end">
                <h4 class="text-success mb-1">${task.budget}</h4>
                <small class="text-muted">Budget</small>
            </div>
        </div>
    `;

    // Task Description
    const taskDescription = document.getElementById('taskDescription');
    taskDescription.innerHTML = `
        <p class="lead">${task.description}</p>
    `;

    // Task Requirements (if available)
    const taskRequirements = document.getElementById('taskRequirements');
    taskRequirements.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6><i class="fas fa-map-marker-alt me-2"></i>Location</h6>
                <p class="text-muted">${task.location}</p>
            </div>
            <div class="col-md-6">
                <h6><i class="fas fa-clock me-2"></i>Deadline</h6>
                <p class="text-muted">${formatDate(task.deadline)}</p>
            </div>
        </div>
        ${task.skills ? `
        <div class="mt-3">
            <h6><i class="fas fa-tools me-2"></i>Required Skills</h6>
            <p class="text-muted">${task.skills}</p>
        </div>
        ` : ''}
    `;

    // Task Summary
    const taskSummary = document.getElementById('taskSummary');
    const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    
    taskSummary.innerHTML = `
        <div class="text-center mb-3">
            <div class="h4 text-success mb-1">${task.budget}</div>
            <small class="text-muted">Budget Range</small>
        </div>
        <div class="row text-center mb-3">
            <div class="col-6">
                <div class="text-primary fw-bold">${daysLeft}</div>
                <small class="text-muted">Days Left</small>
            </div>
            <div class="col-6">
                <div class="text-info fw-bold">${task.category}</div>
                <small class="text-muted">Category</small>
            </div>
        </div>
        <div class="text-center">
            <span class="badge bg-${daysLeft <= 3 ? 'danger' : daysLeft <= 7 ? 'warning' : 'success'}">
                ${daysLeft <= 3 ? 'Urgent' : daysLeft <= 7 ? 'Soon' : 'Normal'}
            </span>
        </div>
    `;

    // Poster Information
    const posterInfo = document.getElementById('posterInfo');
    posterInfo.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <div class="avatar-circle me-3">
                ${task.poster.avatar}
            </div>
            <div>
                <h6 class="mb-1">${task.poster.name}</h6>
                <div class="text-warning">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span class="text-muted ms-1">${task.poster.rating}</span>
                </div>
            </div>
        </div>
        <div class="text-center">
            <a href="profile.html?id=${task.poster.id}" class="btn btn-outline-primary btn-sm">
                <i class="fas fa-user me-1"></i>View Profile
            </a>
        </div>
    `;
}

async function loadSimilarTasks(currentTask) {
    const similarTasksContainer = document.getElementById('similarTasks');
    
    try {
        let allTasks = [];
        
        // Try to get tasks from Google Sheets first
        if (window.FijiTaskApp.GoogleSheetsAPI && window.FijiTaskApp.GoogleSheetsAPI.isGoogleSheetsAvailable) {
            allTasks = await window.FijiTaskApp.GoogleSheetsAPI.getTasks();
        } else {
            // Fallback to local data
            allTasks = window.FijiTaskApp.sampleTasks;
        }
        
        // Find similar tasks (same category, different ID)
        const similarTasks = allTasks
            .filter(task => task.category === currentTask.category && task.id !== currentTask.id)
            .slice(0, 3);
        
        if (similarTasks.length > 0) {
            similarTasksContainer.innerHTML = similarTasks.map(task => createSimilarTaskCard(task)).join('');
        } else {
            similarTasksContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">No similar tasks found</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading similar tasks:', error);
        similarTasksContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No similar tasks found</p>
            </div>
        `;
    }
}

function createSimilarTaskCard(task) {
    const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    
    return `
        <div class="col-lg-4 col-md-6">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary">${task.category}</span>
                        <small class="text-muted">${daysLeft} days left</small>
                    </div>
                    <h6 class="card-title">${task.title}</h6>
                    <p class="card-text text-muted small">${task.description.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-success fw-bold">${task.budget}</span>
                        <a href="task-detail.html?id=${task.id}" class="btn btn-primary btn-sm">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateBidSection() {
    if (currentUser) {
        document.getElementById('bidSection').style.display = 'block';
        document.getElementById('loginRequired').style.display = 'none';
        
        // Check if user is the task poster
        if (currentTask && currentTask.poster.name === currentUser.name) {
            document.getElementById('bidSection').innerHTML = `
                <div class="card-header">
                    <h5 class="mb-0"><i class="fas fa-info-circle me-2"></i>Your Task</h5>
                </div>
                <div class="card-body text-center">
                    <p class="text-muted">This is your task. You cannot bid on your own task.</p>
                    <a href="dashboard.html" class="btn btn-primary">
                        <i class="fas fa-tachometer-alt me-2"></i>Go to Dashboard
                    </a>
                </div>
            `;
        }
    } else {
        showLoginRequired();
    }
}

function showLoginRequired() {
    document.getElementById('bidSection').style.display = 'none';
    document.getElementById('loginRequired').style.display = 'block';
}

// Handle bid form submission
document.getElementById('bidForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showLoginRequired();
        return;
    }
    
    const bidData = {
        amount: parseFloat(document.getElementById('bidAmount').value),
        estimatedTime: document.getElementById('estimatedTime').value,
        message: document.getElementById('bidMessage').value,
        taskId: currentTask.id
    };
    
    // Validate bid
    if (bidData.amount <= 0) {
        showFieldError('bidAmount', 'Please enter a valid amount');
        return;
    }
    
    if (bidData.message.trim().length < 10) {
        showFieldError('bidMessage', 'Please provide a detailed message (at least 10 characters)');
        return;
    }
    
    // Submit bid
    submitBid(bidData);
});

async function submitBid(bidData) {
    // Show loading state
    const submitBtn = document.querySelector('#bidForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
    submitBtn.disabled = true;
    
    try {
        // Create bid object
        const bid = {
            id: Date.now(),
            taskId: currentTask.id,
            bidder: currentUser,
            amount: bidData.amount,
            estimatedTime: bidData.estimatedTime,
            message: bidData.message,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };
        
        // Try to store bid in Google Sheets
        if (window.FijiTaskApp.GoogleSheetsAPI && window.FijiTaskApp.GoogleSheetsAPI.isGoogleSheetsAvailable) {
            await window.FijiTaskApp.GoogleSheetsAPI.addBid(bid);
        }
        
        // Store bid locally as well
        if (!window.FijiTaskApp.userBids) {
            window.FijiTaskApp.userBids = [];
        }
        window.FijiTaskApp.userBids.push(bid);
        
        // Show success message
        window.FijiTaskApp.showNotification(
            `Your quote of $${bidData.amount} has been submitted successfully!`, 
            'success'
        );
        
        // Reset form
        document.getElementById('bidForm').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        console.error('Error submitting bid:', error);
        window.FijiTaskApp.showNotification('Error submitting bid. Please try again.', 'danger');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block';
    errorDiv.textContent = message;
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.add('is-invalid');
    field.parentNode.appendChild(errorDiv);
}

function showError(message) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h4 class="text-muted">${message}</h4>
            <a href="browse-tasks.html" class="btn btn-primary">
                <i class="fas fa-arrow-left me-2"></i>Back to Tasks
            </a>
        </div>
    `;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-FJ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Add some CSS for the avatar
const style = document.createElement('style');
style.textContent = `
    .avatar-circle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
    }
`;
document.head.appendChild(style);
