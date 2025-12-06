// Google Sheets API Integration for Fiji Task Marketplace

class GoogleSheetsAPI {
    constructor() {
        this.spreadsheetId = '1iVD0Sy5snBbCVjKY0X7TXfSRIGjbLLMS5ca-jiTHe84';
        this.apiKey = ''; // You'll need to add your Google API key here
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    }

    // Initialize the API
    async init() {
        try {
            // Check if we have tasks data
            const tasks = await this.getTasks();
            if (tasks.length === 0) {
                // Initialize with sample data if sheet is empty
                await this.initializeSampleData();
            }
            return true;
        } catch (error) {
            console.error('Failed to initialize Google Sheets API:', error);
            return false;
        }
    }

    // Get all tasks from the sheet
    async getTasks() {
        try {
            const response = await fetch(
                `${this.baseUrl}/${this.spreadsheetId}/values/Sheet1!A2:G?key=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.parseTasksFromSheet(data.values || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }
    }

    // Parse sheet data into task objects
    parseTasksFromSheet(rows) {
        return rows.map((row, index) => {
            const [title, category, description, budgetRange, location, postedBy, status] = row;
            return {
                id: index + 1,
                title: title || '',
                category: category || '',
                description: description || '',
                budget: budgetRange || '',
                location: location || '',
                poster: {
                    name: postedBy || 'Anonymous',
                    rating: 4.5,
                    avatar: this.getInitials(postedBy || 'A')
                },
                status: status || 'Active',
                deadline: this.generateDeadline(),
                createdAt: new Date().toISOString()
            };
        });
    }

    // Add a new task to the sheet
    async addTask(taskData) {
        try {
            const values = [
                [
                    taskData.title,
                    taskData.category,
                    taskData.description,
                    taskData.budget,
                    taskData.location,
                    taskData.poster.name,
                    'Active'
                ]
            ];

            const response = await fetch(
                `${this.baseUrl}/${this.spreadsheetId}/values/Sheet1!A:G:append?valueInputOption=RAW&key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        values: values
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Task added successfully:', result);
            return result;
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    }

    // Update task status
    async updateTaskStatus(taskId, status) {
        try {
            const response = await fetch(
                `${this.baseUrl}/${this.spreadsheetId}/values/Sheet1!G${taskId + 1}?valueInputOption=RAW&key=${this.apiKey}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        values: [[status]]
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating task status:', error);
            throw error;
        }
    }

    // Get bids for a specific task
    async getBids(taskId) {
        try {
            const response = await fetch(
                `${this.baseUrl}/${this.spreadsheetId}/values/Bids!A2:F?key=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const allBids = data.values || [];
            
            // Filter bids for the specific task
            return allBids
                .filter(bid => bid[0] === taskId.toString())
                .map((bid, index) => ({
                    id: index + 1,
                    taskId: bid[0],
                    bidderName: bid[1],
                    amount: bid[2],
                    message: bid[3],
                    estimatedTime: bid[4],
                    status: bid[5] || 'Pending'
                }));
        } catch (error) {
            console.error('Error fetching bids:', error);
            return [];
        }
    }

    // Add a new bid
    async addBid(bidData) {
        try {
            const values = [
                [
                    bidData.taskId.toString(),
                    bidData.bidderName,
                    bidData.amount,
                    bidData.message,
                    bidData.estimatedTime,
                    'Pending'
                ]
            ];

            const response = await fetch(
                `${this.baseUrl}/${this.spreadsheetId}/values/Bids!A:F:append?valueInputOption=RAW&key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        values: values
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding bid:', error);
            throw error;
        }
    }

    // Initialize sheet with sample data
    async initializeSampleData() {
        const sampleTasks = [
            ['House Cleaning Needed in Suva', 'Cleaning', 'Looking for reliable house cleaner for weekly cleaning. 3-bedroom house, prefer morning hours. Need someone trustworthy and thorough.', '$80-120', 'Suva', 'Ravikesh.G', 'Active'],
            ['Math Tutoring for Grade 10 Student', 'Tutoring', 'Need help with algebra and geometry. 2 hours per week, flexible schedule. Student is struggling with quadratic equations.', '$60-80', 'Nadi', 'John D.', 'Active'],
            ['Package Delivery from Airport', 'Delivery', 'Pick up package from Nadi Airport and deliver to Lautoka. Urgent delivery needed within 2 hours. Package is small and light.', '$40-60', 'Nadi to Lautoka', 'Maria L.', 'Active'],
            ['Plumbing Repair - Leaky Faucet', 'Handyman', 'Kitchen faucet needs repair. Simple fix, have tools available. Need someone with plumbing experience.', '$50-70', 'Lautoka', 'David K.', 'Active'],
            ['Garden Maintenance', 'Gardening', 'Weekly garden maintenance including mowing, weeding, and pruning. Large garden area, need someone with experience.', '$100-150', 'Suva', 'Lisa R.', 'Active'],
            ['Computer Setup and Installation', 'Technology', 'Help setting up new laptop and installing necessary software. Need Windows 10 setup and office applications.', '$80-100', 'Nadi', 'Mike T.', 'Active'],
            ['Car Wash and Interior Cleaning', 'Cleaning', 'Full car wash and interior cleaning needed. SUV size vehicle, need detailed cleaning service.', '$70-90', 'Suva', 'Peter S.', 'Active'],
            ['English Language Tutoring', 'Tutoring', 'Conversational English practice for adult learner. 1 hour sessions, focus on speaking and pronunciation.', '$50-70', 'Lautoka', 'Anna M.', 'Active'],
            ['Furniture Assembly', 'Handyman', 'IKEA furniture assembly needed. 2 bedroom sets and dining table. Need someone with experience.', '$120-180', 'Nadi', 'Robert L.', 'Active'],
            ['Pet Sitting - Weekend Care', 'Pet Care', 'Looking for pet sitter for 2 dogs over the weekend. Need someone who loves animals and has experience.', '$80-100', 'Suva', 'Emma W.', 'Active'],
            ['Website Design for Small Business', 'Technology', 'Need a simple website for my local bakery. 5 pages including home, about, menu, contact. Modern design preferred.', '$200-300', 'Suva', 'Sarah Chen', 'Active'],
            ['Moving Assistance - Apartment Relocation', 'Moving', 'Help moving from 2-bedroom apartment to new location in Suva. Need truck and 2 people for 4 hours.', '$150-200', 'Suva', 'James Wilson', 'Active'],
            ['Cooking Classes - Traditional Fijian Food', 'Cooking', 'Learn to cook traditional Fijian dishes. 3-hour session for 4 people. All ingredients provided.', '$120-150', 'Nadi', 'Mereani Tui', 'Active'],
            ['Photography for Birthday Party', 'Photography', 'Professional photographer needed for 5th birthday party. 2 hours coverage, 50+ edited photos.', '$100-150', 'Lautoka', 'Jennifer Park', 'Active'],
            ['Lawn Mowing and Trimming', 'Gardening', 'Regular lawn maintenance for residential property. Monthly service needed, includes edging and cleanup.', '$60-80', 'Suva', 'Tom Brown', 'Active'],
            ['Language Translation - English to Hindi', 'Translation', 'Translate business documents from English to Hindi. 5 pages, professional quality needed.', '$80-120', 'Nadi', 'Priya Sharma', 'Active'],
            ['Home Security System Installation', 'Technology', 'Install wireless security cameras and alarm system. 4 cameras, smartphone app setup included.', '$250-350', 'Lautoka', 'Mark Johnson', 'Active'],
            ['Deep House Cleaning - Spring Clean', 'Cleaning', 'Complete deep cleaning of 4-bedroom house. Includes windows, carpets, and detailed kitchen/bathroom cleaning.', '$150-200', 'Suva', 'Rachel Green', 'Active'],
            ['Personal Training Session', 'Fitness', 'One-on-one fitness training session. 1 hour, focus on strength training. Gym membership required.', '$70-90', 'Nadi', 'Alex Thompson', 'Active'],
            ['Car Mechanic - Oil Change and Service', 'Automotive', 'Regular car service including oil change, filter replacement, and basic inspection. Bring your own oil.', '$40-60', 'Lautoka', 'Sam Kumar', 'Active'],
            ['Event Planning - Corporate Meeting', 'Event Planning', 'Organize small corporate meeting for 20 people. Venue booking, catering coordination, and setup.', '$200-300', 'Suva', 'Lisa Anderson', 'Active'],
            ['Graphic Design - Logo Creation', 'Design', 'Create professional logo for new restaurant. Modern, clean design. Multiple concepts needed.', '$100-150', 'Nadi', 'David Lee', 'Active'],
            ['House Painting - Interior Rooms', 'Painting', 'Paint 3 bedrooms and living room. Neutral colors, professional finish required. Paint provided.', '$300-400', 'Lautoka', 'Michael Ross', 'Active'],
            ['Data Entry - Excel Spreadsheet', 'Administrative', 'Enter customer data into Excel spreadsheet. 200 records, attention to detail required.', '$50-70', 'Suva', 'Nancy Davis', 'Active'],
            ['Music Lessons - Guitar for Beginners', 'Music', 'Learn basic guitar chords and songs. 1-hour lesson, guitar provided. Suitable for complete beginners.', '$60-80', 'Nadi', 'Carlos Rodriguez', 'Active'],
            ['Home Organization - Closet Decluttering', 'Organization', 'Help organize and declutter bedroom closets. Sort, donate, and create organized storage system.', '$80-120', 'Suva', 'Amanda White', 'Active'],
            ['Social Media Management', 'Marketing', 'Manage Instagram and Facebook accounts for small business. 3 posts per week, engagement monitoring.', '$150-200', 'Lautoka', 'Sophie Martin', 'Active'],
            ['Bicycle Repair and Tune-up', 'Automotive', 'Complete bicycle service including brake adjustment, gear tuning, and tire check. Bring bike to location.', '$30-50', 'Nadi', 'Kevin Wong', 'Active'],
            ['Cooking Meal Prep Service', 'Cooking', 'Prepare 10 healthy meals for the week. Dietary restrictions accommodated. Containers provided.', '$100-130', 'Suva', 'Maria Garcia', 'Active'],
            ['Home Inspection - Pre-purchase', 'Inspection', 'Professional home inspection before purchase. Detailed report on structural and electrical systems.', '$200-250', 'Lautoka', 'Robert Taylor', 'Active']
        ];

        try {
            const response = await fetch(
                `${this.baseUrl}/${this.spreadsheetId}/values/Sheet1!A2:G?valueInputOption=RAW&key=${this.apiKey}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        values: sampleTasks
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Sample data initialized successfully');
        } catch (error) {
            console.error('Error initializing sample data:', error);
        }
    }

    // Utility functions
    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    generateDeadline() {
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 14) + 7); // 7-21 days from now
        return date.toISOString().split('T')[0];
    }

    // Fallback to local storage if API is not available
    async getTasksFallback() {
        const storedTasks = localStorage.getItem('fijiTaskTasks');
        if (storedTasks) {
            return JSON.parse(storedTasks);
        }
        return [];
    }

    async addTaskFallback(taskData) {
        const tasks = await this.getTasksFallback();
        const newTask = {
            id: tasks.length + 1,
            ...taskData,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        localStorage.setItem('fijiTaskTasks', JSON.stringify(tasks));
        return newTask;
    }
}

// Create global instance
window.GoogleSheetsAPI = new GoogleSheetsAPI();

// Export for use in other files
window.FijiTaskApp = window.FijiTaskApp || {};
window.FijiTaskApp.GoogleSheetsAPI = window.GoogleSheetsAPI;
