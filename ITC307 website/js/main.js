// Fiji Task Marketplace - Main JavaScript

// Global variables for tasks and API
let sampleTasks = [];
let googleSheetsAPI = null;
let isGoogleSheetsAvailable = false;

// Categories data
const categories = [
    { name: "Delivery", icon: "fas fa-truck", color: "primary" },
    { name: "Cleaning", icon: "fas fa-broom", color: "success" },
    { name: "Tutoring", icon: "fas fa-graduation-cap", color: "info" },
    { name: "Handyman", icon: "fas fa-tools", color: "warning" },
    { name: "Gardening", icon: "fas fa-seedling", color: "success" },
    { name: "Technology", icon: "fas fa-laptop", color: "info" },
    { name: "Pet Care", icon: "fas fa-paw", color: "warning" },
    { name: "Event Planning", icon: "fas fa-calendar", color: "primary" }
];

// Categories data
const categories = [
    { name: "Delivery", icon: "fas fa-truck", color: "primary" },
    { name: "Cleaning", icon: "fas fa-broom", color: "success" },
    { name: "Tutoring", icon: "fas fa-graduation-cap", color: "info" },
    { name: "Handyman", icon: "fas fa-tools", color: "warning" },
    { name: "Gardening", icon: "fas fa-seedling", color: "success" },
    { name: "Technology", icon: "fas fa-laptop", color: "info" },
    { name: "Pet Care", icon: "fas fa-paw", color: "warning" },
    { name: "Event Planning", icon: "fas fa-calendar", color: "primary" }
];

// User session management
let currentUser = null;
let userTasks = [];
let userBids = [];

// Initialize userBids in global scope
window.FijiTaskApp = window.FijiTaskApp || {};
window.FijiTaskApp.userBids = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});

async function initializeApp() {
    await initializeGoogleSheets();
    await loadRecentTasks();
    setupEventListeners();
    checkUserSession();
}

async function initializeGoogleSheets() {
    try {
        // Check if Google Sheets API is available
        if (window.GoogleSheetsAPI) {
            googleSheetsAPI = window.GoogleSheetsAPI;
            isGoogleSheetsAvailable = await googleSheetsAPI.init();
            
            if (isGoogleSheetsAvailable) {
                console.log('Google Sheets API initialized successfully');
                // Load tasks from Google Sheets
                sampleTasks = await googleSheetsAPI.getTasks();
            } else {
                console.log('Google Sheets API not available, using fallback');
                // Load from local storage as fallback
                sampleTasks = await googleSheetsAPI.getTasksFallback();
            }
        } else {
            console.log('Google Sheets API not loaded, using local storage');
            // Load from local storage
            const storedTasks = localStorage.getItem('fijiTaskTasks');
            sampleTasks = storedTasks ? JSON.parse(storedTasks) : [];
        }
    } catch (error) {
        console.error('Error initializing Google Sheets:', error);
        // Fallback to local storage
        const storedTasks = localStorage.getItem('fijiTaskTasks');
        sampleTasks = storedTasks ? JSON.parse(storedTasks) : [];
    }
}

// Load recent tasks on homepage
async function loadRecentTasks() {
    const recentTasksContainer = document.getElementById('recentTasks');
    if (!recentTasksContainer) return;

    // Wait for tasks to be loaded
    if (sampleTasks.length === 0) {
        await initializeGoogleSheets();
    }

    // Display first 6 tasks
    const recentTasks = sampleTasks.slice(0, 6);
    
    recentTasksContainer.innerHTML = recentTasks.map(task => createTaskCard(task)).join('');
}

// Create task card HTML
function createTaskCard(task) {
    const deadline = new Date(task.deadline);
    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
    
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="task-card">
                <div class="task-category badge bg-light text-dark">${task.category}</div>
                <h5 class="task-title">${task.title}</h5>
                <p class="task-description">${task.description}</p>
                
                <div class="task-meta">
                    <span class="task-budget">${task.budget}</span>
                    <span class="task-location"><i class="fas fa-map-marker-alt me-1"></i>${task.location}</span>
                </div>
                
                <div class="task-poster">
                    <div class="poster-avatar">${task.poster.avatar}</div>
                    <div class="poster-info">
                        <div class="poster-name">${task.poster.name}</div>
                        <div class="poster-rating">
                            <i class="fas fa-star"></i> ${task.poster.rating}
                        </div>
                    </div>
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                    <span class="task-deadline">
                        <i class="fas fa-clock me-1"></i>${daysLeft} days left
                    </span>
                    <a href="task-detail.html?id=${task.id}" class="btn btn-primary btn-sm">
                        View Details
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Category card clicks
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h5').textContent.toLowerCase();
            window.location.href = `browse-tasks.html?category=${category}`;
        });
    });

    // Search functionality
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    // Filter functionality
    const filterInputs = document.querySelectorAll('.filter-input');
    filterInputs.forEach(input => {
        input.addEventListener('change', handleFilter);
    });
}

// Handle search
function handleSearch(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    
    // Store search parameters in sessionStorage
    sessionStorage.setItem('searchTerm', searchTerm);
    sessionStorage.setItem('searchCategory', category);
    
    window.location.href = 'browse-tasks.html';
}

// Handle filters
function handleFilter() {
    const filters = {
        category: document.getElementById('categoryFilter')?.value || '',
        budget: document.getElementById('budgetFilter')?.value || '',
        location: document.getElementById('locationFilter')?.value || '',
        deadline: document.getElementById('deadlineFilter')?.value || ''
    };
    
    filterTasks(filters);
}

// Filter tasks based on criteria
function filterTasks(filters) {
    let filteredTasks = [...sampleTasks];
    
    if (filters.category) {
        filteredTasks = filteredTasks.filter(task => 
            task.category.toLowerCase() === filters.category.toLowerCase()
        );
    }
    
    if (filters.location) {
        filteredTasks = filteredTasks.filter(task => 
            task.location.toLowerCase().includes(filters.location.toLowerCase())
        );
    }
    
    if (filters.deadline) {
        const filterDate = new Date(filters.deadline);
        filteredTasks = filteredTasks.filter(task => 
            new Date(task.deadline) <= filterDate
        );
    }
    
    displayTasks(filteredTasks);
}

// Display tasks in container
function displayTasks(tasks) {
    const container = document.getElementById('tasksContainer');
    if (!container) return;
    
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No tasks found</h4>
                <p class="text-muted">Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tasks.map(task => createTaskCard(task)).join('');
}

// User session management
function checkUserSession() {
    const savedUser = localStorage.getItem('fijiTaskUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
}

function updateUserInterface() {
    if (currentUser) {
        // Update navigation for logged-in user
        const authButtons = document.querySelector('.navbar-nav .btn');
        if (authButtons) {
            authButtons.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="fas fa-user me-1"></i>${currentUser.name}
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="dashboard.html">Dashboard</a></li>
                        <li><a class="dropdown-item" href="profile.html">Profile</a></li>
                        <li><a class="dropdown-item" href="my-tasks.html">My Tasks</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
                    </ul>
                </div>
            `;
        }
    }
}

// Authentication functions
function login(email, password) {
    // Simulate login - in real app, this would be an API call
    const user = {
        id: 1,
        name: "John Doe",
        email: email,
        rating: 4.8,
        completedTasks: 15,
        avatar: "JD"
    };
    
    currentUser = user;
    localStorage.setItem('fijiTaskUser', JSON.stringify(user));
    updateUserInterface();
    
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('fijiTaskUser');
    window.location.href = 'home.html';
}

// Task management functions
async function postTask(taskData) {
    const newTask = {
        id: sampleTasks.length + 1,
        ...taskData,
        poster: {
            name: currentUser.name,
            rating: currentUser.rating,
            avatar: currentUser.avatar
        },
        status: 'open',
        createdAt: new Date().toISOString()
    };
    
    try {
        if (isGoogleSheetsAvailable && googleSheetsAPI) {
            // Add to Google Sheets
            await googleSheetsAPI.addTask(newTask);
        } else {
            // Add to local storage as fallback
            await googleSheetsAPI.addTaskFallback(newTask);
        }
        
        // Update local array
        sampleTasks.unshift(newTask);
        userTasks.push(newTask);
        
        // Update local storage
        localStorage.setItem('fijiTaskTasks', JSON.stringify(sampleTasks));
        
        return newTask;
    } catch (error) {
        console.error('Error posting task:', error);
        // Fallback to local storage only
        sampleTasks.unshift(newTask);
        userTasks.push(newTask);
        localStorage.setItem('fijiTaskTasks', JSON.stringify(sampleTasks));
        return newTask;
    }
}

function submitBid(taskId, bidData) {
    const bid = {
        id: Date.now(),
        taskId: taskId,
        bidder: currentUser,
        ...bidData,
        submittedAt: new Date().toISOString(),
        status: 'pending'
    };
    
    userBids.push(bid);
    return bid;
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-FJ', {
        style: 'currency',
        currency: 'FJD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-FJ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Export functions for use in other files
window.FijiTaskApp = {
    login,
    logout,
    postTask,
    submitBid,
    formatCurrency,
    formatDate,
    showNotification,
    sampleTasks,
    categories
};
