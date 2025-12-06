// Dashboard JavaScript

let currentUser = null;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    checkUserSession();
    loadDashboardData();
}

function checkUserSession() {
    const savedUser = localStorage.getItem('fijiTaskUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    } else {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
    }
}

function updateUserInterface() {
    if (currentUser) {
        // Update welcome message
        document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.name}!`;
        
        // Update user dropdown
        const userDropdown = document.getElementById('userDropdown');
        userDropdown.innerHTML = `
            <i class="fas fa-user me-1"></i>${currentUser.name}
        `;
    }
}

async function loadDashboardData() {
    await loadStats();
    await loadPostedTasks();
    await loadSubmittedBids();
    loadActivity();
}

async function loadStats() {
    try {
        let allTasks = [];
        
        // Get tasks from Google Sheets or local storage
        if (window.FijiTaskApp.GoogleSheetsAPI && window.FijiTaskApp.GoogleSheetsAPI.isGoogleSheetsAvailable) {
            allTasks = await window.FijiTaskApp.GoogleSheetsAPI.getTasks();
        } else {
            allTasks = window.FijiTaskApp.sampleTasks;
        }
        
        // Get user's posted tasks
        const postedTasks = allTasks.filter(task => 
            task.poster.name === currentUser.name
        );
        
        // Get user's submitted bids
        const submittedBids = window.FijiTaskApp.userBids || [];
        
        // Update stats
        document.getElementById('postedTasksCount').textContent = postedTasks.length;
        document.getElementById('submittedBidsCount').textContent = submittedBids.length;
        document.getElementById('userRating').textContent = currentUser.rating || '0.0';
        document.getElementById('completedTasksCount').textContent = currentUser.completedTasks || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to local data
        const postedTasks = window.FijiTaskApp.sampleTasks.filter(task => 
            task.poster.name === currentUser.name
        );
        const submittedBids = window.FijiTaskApp.userBids || [];
        
        document.getElementById('postedTasksCount').textContent = postedTasks.length;
        document.getElementById('submittedBidsCount').textContent = submittedBids.length;
        document.getElementById('userRating').textContent = currentUser.rating || '0.0';
        document.getElementById('completedTasksCount').textContent = currentUser.completedTasks || 0;
    }
}

async function loadPostedTasks() {
    const postedTasksList = document.getElementById('postedTasksList');
    
    try {
        let allTasks = [];
        
        // Get tasks from Google Sheets or local storage
        if (window.FijiTaskApp.GoogleSheetsAPI && window.FijiTaskApp.GoogleSheetsAPI.isGoogleSheetsAvailable) {
            allTasks = await window.FijiTaskApp.GoogleSheetsAPI.getTasks();
        } else {
            allTasks = window.FijiTaskApp.sampleTasks;
        }
        
        const postedTasks = allTasks.filter(task => 
            task.poster.name === currentUser.name
        );
        
        if (postedTasks.length === 0) {
            postedTasksList.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No tasks posted yet</h5>
                    <p class="text-muted">Start by posting your first task</p>
                    <a href="post-task.html" class="btn btn-primary">
                        <i class="fas fa-plus me-2"></i>Post Your First Task
                    </a>
                </div>
            `;
            return;
        }
        
        postedTasksList.innerHTML = postedTasks.map(task => createPostedTaskCard(task)).join('');
    } catch (error) {
        console.error('Error loading posted tasks:', error);
        // Fallback to local data
        const postedTasks = window.FijiTaskApp.sampleTasks.filter(task => 
            task.poster.name === currentUser.name
        );
        
        if (postedTasks.length === 0) {
            postedTasksList.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No tasks posted yet</h5>
                    <p class="text-muted">Start by posting your first task</p>
                    <a href="post-task.html" class="btn btn-primary">
                        <i class="fas fa-plus me-2"></i>Post Your First Task
                    </a>
                </div>
            `;
        } else {
            postedTasksList.innerHTML = postedTasks.map(task => createPostedTaskCard(task)).join('');
        }
    }
}

function createPostedTaskCard(task) {
    const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    const bidsCount = Math.floor(Math.random() * 5) + 1; // Simulate bid count
    
    return `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title mb-1">${task.title}</h6>
                            <span class="badge bg-${task.status === 'open' ? 'success' : 'secondary'}">${task.status}</span>
                        </div>
                        <p class="card-text text-muted small mb-2">${task.description.substring(0, 100)}...</p>
                        <div class="d-flex gap-3 text-muted small">
                            <span><i class="fas fa-map-marker-alt me-1"></i>${task.location}</span>
                            <span><i class="fas fa-clock me-1"></i>${daysLeft} days left</span>
                            <span><i class="fas fa-dollar-sign me-1"></i>${task.budget}</span>
                        </div>
                    </div>
                    <div class="col-md-4 text-end">
                        <div class="mb-2">
                            <span class="badge bg-info">${bidsCount} bids received</span>
                        </div>
                        <div class="btn-group" role="group">
                            <a href="task-detail.html?id=${task.id}" class="btn btn-outline-primary btn-sm">
                                <i class="fas fa-eye me-1"></i>View
                            </a>
                            <button class="btn btn-outline-success btn-sm" onclick="viewBids(${task.id})">
                                <i class="fas fa-gavel me-1"></i>Bids
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadSubmittedBids() {
    const submittedBidsList = document.getElementById('submittedBidsList');
    const submittedBids = window.FijiTaskApp.userBids || [];
    
    if (submittedBids.length === 0) {
        submittedBidsList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-gavel fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No bids submitted yet</h5>
                <p class="text-muted">Start bidding on tasks to earn money</p>
                <a href="browse-tasks.html" class="btn btn-primary">
                    <i class="fas fa-search me-2"></i>Browse Tasks
                </a>
            </div>
        `;
        return;
    }
    
    submittedBidsList.innerHTML = submittedBids.map(bid => createBidCard(bid)).join('');
}

function createBidCard(bid) {
    // Find the task for this bid
    const task = window.FijiTaskApp.sampleTasks.find(t => t.id == bid.taskId);
    
    if (!task) {
        return `
            <div class="card mb-3">
                <div class="card-body">
                    <p class="text-muted">Task not found</p>
                </div>
            </div>
        `;
    }
    
    const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    
    return `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h6 class="card-title mb-1">${task.title}</h6>
                        <p class="card-text text-muted small mb-2">${task.description.substring(0, 100)}...</p>
                        <div class="d-flex gap-3 text-muted small mb-2">
                            <span><i class="fas fa-map-marker-alt me-1"></i>${task.location}</span>
                            <span><i class="fas fa-clock me-1"></i>${daysLeft} days left</span>
                        </div>
                        <div class="mb-2">
                            <strong>Your Quote:</strong> $${bid.amount}
                            ${bid.estimatedTime ? `<span class="text-muted ms-2">(${bid.estimatedTime})</span>` : ''}
                        </div>
                        <p class="text-muted small mb-0">${bid.message.substring(0, 80)}...</p>
                    </div>
                    <div class="col-md-4 text-end">
                        <div class="mb-2">
                            <span class="badge bg-${bid.status === 'accepted' ? 'success' : bid.status === 'rejected' ? 'danger' : 'warning'}">
                                ${bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                            </span>
                        </div>
                        <div class="btn-group" role="group">
                            <a href="task-detail.html?id=${task.id}" class="btn btn-outline-primary btn-sm">
                                <i class="fas fa-eye me-1"></i>View Task
                            </a>
                            <button class="btn btn-outline-info btn-sm" onclick="viewBidDetails(${bid.id})">
                                <i class="fas fa-info me-1"></i>Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadActivity() {
    const activityList = document.getElementById('activityList');
    
    // Create sample activity data
    const activities = [
        {
            type: 'task_posted',
            title: 'Posted a new task',
            description: 'House Cleaning Needed in Suva',
            time: '2 hours ago',
            icon: 'fas fa-plus-circle',
            color: 'text-primary'
        },
        {
            type: 'bid_submitted',
            title: 'Submitted a bid',
            description: 'Math Tutoring for Grade 10 Student',
            time: '1 day ago',
            icon: 'fas fa-gavel',
            color: 'text-success'
        },
        {
            type: 'bid_accepted',
            title: 'Bid accepted',
            description: 'Garden Maintenance task',
            time: '3 days ago',
            icon: 'fas fa-check-circle',
            color: 'text-success'
        },
        {
            type: 'task_completed',
            title: 'Task completed',
            description: 'Computer Setup and Installation',
            time: '1 week ago',
            icon: 'fas fa-star',
            color: 'text-warning'
        }
    ];
    
    activityList.innerHTML = activities.map(activity => createActivityCard(activity)).join('');
}

function createActivityCard(activity) {
    return `
        <div class="d-flex align-items-start mb-3">
            <div class="flex-shrink-0 me-3">
                <i class="${activity.icon} fa-lg ${activity.color}"></i>
            </div>
            <div class="flex-grow-1">
                <h6 class="mb-1">${activity.title}</h6>
                <p class="text-muted mb-1">${activity.description}</p>
                <small class="text-muted">${activity.time}</small>
            </div>
        </div>
    `;
}

// Utility functions
function viewBids(taskId) {
    // In a real app, this would show a modal or navigate to a bids page
    window.FijiTaskApp.showNotification('Bids feature coming soon!', 'info');
}

function viewBidDetails(bidId) {
    // In a real app, this would show bid details in a modal
    window.FijiTaskApp.showNotification('Bid details feature coming soon!', 'info');
}

// Global logout function
function logout() {
    window.FijiTaskApp.logout();
}
