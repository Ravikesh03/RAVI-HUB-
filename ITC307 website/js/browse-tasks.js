// Browse Tasks Page JavaScript

let currentTasks = [];
let filteredTasks = [];
let currentPage = 1;
let tasksPerPage = 9;
let isGridView = true;

// Initialize browse tasks page
document.addEventListener('DOMContentLoaded', async function() {
    await initializeBrowseTasks();
});

async function initializeBrowseTasks() {
    // Load all tasks from Google Sheets or local storage
    try {
        if (window.FijiTaskApp.GoogleSheetsAPI && window.FijiTaskApp.GoogleSheetsAPI.isGoogleSheetsAvailable) {
            currentTasks = await window.FijiTaskApp.GoogleSheetsAPI.getTasks();
        } else {
            currentTasks = [...window.FijiTaskApp.sampleTasks];
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        currentTasks = [...window.FijiTaskApp.sampleTasks];
    }
    
    filteredTasks = [...currentTasks];
    
    // Check for URL parameters
    checkUrlParameters();
    
    // Setup event listeners
    setupBrowseEventListeners();
    
    // Display tasks
    displayTasks();
    
    // Update stats
    updateStats();
}

function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const searchTerm = sessionStorage.getItem('searchTerm');
    const searchCategory = sessionStorage.getItem('searchCategory');
    
    if (category) {
        document.getElementById('categoryFilter').value = category;
        filterTasks();
    }
    
    if (searchTerm) {
        document.getElementById('searchInput').value = searchTerm;
        if (searchCategory) {
            document.getElementById('categoryFilter').value = searchCategory;
        }
        performSearch();
        
        // Clear session storage
        sessionStorage.removeItem('searchTerm');
        sessionStorage.removeItem('searchCategory');
    }
}

function setupBrowseEventListeners() {
    // Filter change events
    document.getElementById('categoryFilter').addEventListener('change', filterTasks);
    document.getElementById('budgetFilter').addEventListener('change', filterTasks);
    document.getElementById('locationFilter').addEventListener('change', filterTasks);
    document.getElementById('deadlineFilter').addEventListener('change', filterTasks);
    document.getElementById('sortFilter').addEventListener('change', filterTasks);
    
    // Search input events
    document.getElementById('searchInput').addEventListener('input', debounce(performSearch, 300));
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        filteredTasks = [...currentTasks];
    } else {
        filteredTasks = currentTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm) ||
            task.category.toLowerCase().includes(searchTerm) ||
            task.location.toLowerCase().includes(searchTerm) ||
            task.poster.name.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    displayTasks();
    updateSearchInfo();
}

function filterTasks() {
    const category = document.getElementById('categoryFilter').value;
    const budget = document.getElementById('budgetFilter').value;
    const location = document.getElementById('locationFilter').value;
    const deadline = document.getElementById('deadlineFilter').value;
    const sortBy = document.getElementById('sortFilter').value;
    
    let filtered = [...currentTasks];
    
    // Apply category filter
    if (category) {
        filtered = filtered.filter(task => 
            task.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Apply budget filter
    if (budget) {
        filtered = filtered.filter(task => {
            const taskBudget = extractBudgetRange(task.budget);
            switch (budget) {
                case '0-50':
                    return taskBudget.max <= 50;
                case '50-100':
                    return taskBudget.min >= 50 && taskBudget.max <= 100;
                case '100-200':
                    return taskBudget.min >= 100 && taskBudget.max <= 200;
                case '200+':
                    return taskBudget.min >= 200;
                default:
                    return true;
            }
        });
    }
    
    // Apply location filter
    if (location) {
        filtered = filtered.filter(task => 
            task.location.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    // Apply deadline filter
    if (deadline) {
        const today = new Date();
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        filtered = filtered.filter(task => {
            const taskDeadline = new Date(task.deadline);
            switch (deadline) {
                case 'today':
                    return taskDeadline.toDateString() === today.toDateString();
                case 'week':
                    return taskDeadline <= weekFromNow;
                case 'month':
                    return taskDeadline <= monthFromNow;
                default:
                    return true;
            }
        });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'deadline':
                return new Date(a.deadline) - new Date(b.deadline);
            case 'budget-high':
                return extractBudgetRange(b.budget).max - extractBudgetRange(a.budget).max;
            case 'budget-low':
                return extractBudgetRange(a.budget).min - extractBudgetRange(b.budget).min;
            case 'rating':
                return b.poster.rating - a.poster.rating;
            case 'newest':
            default:
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
    });
    
    filteredTasks = filtered;
    currentPage = 1;
    displayTasks();
    updateSearchInfo();
}

function extractBudgetRange(budgetString) {
    const numbers = budgetString.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
        return {
            min: parseInt(numbers[0]),
            max: parseInt(numbers[1])
        };
    } else if (numbers && numbers.length === 1) {
        return {
            min: parseInt(numbers[0]),
            max: parseInt(numbers[0])
        };
    }
    return { min: 0, max: 0 };
}

function displayTasks() {
    const container = document.getElementById('tasksContainer');
    const noResults = document.getElementById('noResults');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    
    if (filteredTasks.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        loadMoreContainer.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const tasksToShow = filteredTasks.slice(startIndex, endIndex);
    
    // Display tasks
    if (isGridView) {
        container.innerHTML = tasksToShow.map(task => createTaskCard(task)).join('');
    } else {
        container.innerHTML = tasksToShow.map(task => createTaskListCard(task)).join('');
    }
    
    // Show/hide load more button
    if (endIndex < filteredTasks.length) {
        loadMoreContainer.style.display = 'block';
    } else {
        loadMoreContainer.style.display = 'none';
    }
}

function createTaskListCard(task) {
    const deadline = new Date(task.deadline);
    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
    
    return `
        <div class="col-12 mb-3">
            <div class="card task-card">
                <div class="row g-0">
                    <div class="col-md-8">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title task-title mb-0">${task.title}</h5>
                                <span class="task-category badge bg-light text-dark">${task.category}</span>
                            </div>
                            <p class="card-text task-description">${task.description}</p>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="task-poster">
                                        <div class="poster-avatar">${task.poster.avatar}</div>
                                        <div class="poster-info">
                                            <div class="poster-name">${task.poster.name}</div>
                                            <div class="poster-rating">
                                                <i class="fas fa-star"></i> ${task.poster.rating}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="task-meta">
                                        <div class="task-budget mb-1">${task.budget}</div>
                                        <div class="task-location">
                                            <i class="fas fa-map-marker-alt me-1"></i>${task.location}
                                        </div>
                                        <div class="task-deadline">
                                            <i class="fas fa-clock me-1"></i>${daysLeft} days left
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 d-flex align-items-center justify-content-center p-3">
                        <a href="task-detail.html?id=${task.id}" class="btn btn-primary">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadMoreTasks() {
    currentPage++;
    displayTasks();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('budgetFilter').value = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('deadlineFilter').value = '';
    document.getElementById('sortFilter').value = 'newest';
    
    filteredTasks = [...currentTasks];
    currentPage = 1;
    displayTasks();
    updateSearchInfo();
}

function toggleView() {
    isGridView = !isGridView;
    const viewIcon = document.getElementById('viewIcon');
    
    if (isGridView) {
        viewIcon.className = 'fas fa-th-large';
    } else {
        viewIcon.className = 'fas fa-list';
    }
    
    displayTasks();
}

function updateSearchInfo() {
    const searchResultsText = document.getElementById('searchResultsText');
    const resultsCount = document.getElementById('resultsCount');
    const searchInfo = document.getElementById('searchInfo');
    
    const searchTerm = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    
    let text = '';
    
    if (searchTerm && category) {
        text = `Showing results for "${searchTerm}" in ${category}`;
    } else if (searchTerm) {
        text = `Showing results for "${searchTerm}"`;
    } else if (category) {
        text = `Showing ${category} tasks`;
    } else {
        text = 'Showing all available tasks';
    }
    
    searchResultsText.textContent = text;
    resultsCount.textContent = filteredTasks.length;
    
    // Show/hide search info
    if (searchTerm || category) {
        searchInfo.style.display = 'flex';
    } else {
        searchInfo.style.display = 'none';
    }
}

function updateStats() {
    const totalTasks = document.getElementById('totalTasks');
    const activeTasks = document.getElementById('activeTasks');
    
    totalTasks.textContent = currentTasks.length;
    activeTasks.textContent = currentTasks.filter(task => task.status === 'open').length;
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global access
window.browseTasksFunctions = {
    performSearch,
    filterTasks,
    clearFilters,
    toggleView,
    loadMoreTasks
};
