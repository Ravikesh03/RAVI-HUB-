# Fiji Task Marketplace

A desktop-first responsive website for connecting skills with opportunities across Fiji. This platform allows users to post small tasks and others to bid on completing them.

## 🌟 Features

### Core Functionality
- **Task Posting**: Multi-step form for creating detailed task listings
- **Task Browsing**: Advanced search and filtering with sidebar navigation
- **Bidding System**: Users can submit bids on tasks with pricing and messages
- **User Profiles**: Comprehensive profiles with ratings and task history
- **Dashboard**: Centralized management for tasks, bids, and messages

### Desktop-First Design
- **Responsive Layout**: Optimized for desktop with mobile fallback
- **Sidebar Navigation**: Persistent filters and navigation panels
- **Grid Layouts**: 3-4 column task grids for optimal desktop viewing
- **Professional UI**: Clean, modern design with soft neutral colors

### User Experience
- **Multi-step Forms**: Guided task posting process
- **Real-time Search**: Instant filtering and search results
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation

1. **Clone or Download** the project files
2. **Navigate** to the project directory
3. **Set up Google Sheets API** (optional - see [Google Sheets Setup Guide](GOOGLE_SHEETS_SETUP.md))
4. **Open** `home.html` in your web browser

### Google Sheets Integration

The website integrates with Google Sheets for data persistence. Your Google Sheet is located at:
[https://docs.google.com/spreadsheets/d/1iVD0Sy5snBbCVjKY0X7TXfSRIGjbLLMS5ca-jiTHe84/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1iVD0Sy5snBbCVjKY0X7TXfSRIGjbLLMS5ca-jiTHe84/edit?gid=0#gid=0)

#### Current Structure:
- **Sheet1**: Tasks (Task Title, Category, Description, Budget Range, Location, Posted By, Status)
- **Bids**: Bids (Task ID, Bidder Name, Amount, Message, Estimated Time, Status)

This allows:
- Real-time data storage and retrieval
- Multi-user access to the same data
- Backup and synchronization capabilities

See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) for detailed setup instructions, or use `setup-google-sheet.html` for a step-by-step setup helper.

### Development Setup

For local development with a web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📁 Project Structure

```
WEB/
├── home.html               # Homepage
├── browse-tasks.html       # Task browsing page
├── post-task.html         # Task posting form
├── login.html             # User login
├── signup.html            # User registration
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js           # Core functionality
│   ├── google-sheets-api.js # Google Sheets integration
│   ├── browse-tasks.js    # Task browsing logic
│   ├── post-task.js      # Task posting logic
│   ├── task-detail.js    # Task detail page logic
│   ├── dashboard.js      # Dashboard functionality
│   ├── login.js          # Authentication logic
│   └── signup.js         # Registration logic
└── README.md             # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: `#0d6efd` (Blue)
- **Success**: `#198754` (Green)
- **Warning**: `#ffc107` (Yellow)
- **Danger**: `#dc3545` (Red)
- **Info**: `#0dcaf0` (Cyan)
- **Light**: `#f8f9fa` (Light Gray)
- **Dark**: `#212529` (Dark Gray)

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover effects
- **Forms**: Clean inputs with focus states
- **Navigation**: Sticky header with dropdown menus

## 🔧 Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Custom properties, Flexbox, Grid, animations
- **JavaScript**: ES6+ features, modular functions
- **Bootstrap 5**: Grid system and components
- **Font Awesome**: Icon library

### Key Features Implementation

#### Task Management
```javascript
// Sample task structure
{
    id: 1,
    title: "House Cleaning Needed in Suva",
    description: "Looking for reliable house cleaner...",
    category: "Cleaning",
    budget: "$80-120",
    location: "Suva",
    deadline: "2024-02-15",
    poster: {
        name: "Sarah M.",
        rating: 4.8,
        avatar: "SM"
    },
    status: "open"
}
```

#### Search & Filtering
- Real-time search with debouncing
- Multi-criteria filtering (category, budget, location, deadline)
- Sort options (newest, deadline, budget, rating)
- Pagination with "Load More" functionality

#### Form Validation
- Client-side validation with real-time feedback
- Step-by-step form progression
- Error handling and user guidance

## 📱 Responsive Design

### Desktop-First Approach
- **Primary Layout**: Optimized for desktop screens (1200px+)
- **Grid Systems**: 3-4 column layouts for task cards
- **Sidebar Navigation**: Persistent filters and navigation
- **Wide Content Areas**: Maximized use of screen real estate

### Mobile Responsiveness
- **Breakpoints**: 768px (tablet), 576px (mobile)
- **Adaptive Layouts**: Single column on mobile devices
- **Touch-Friendly**: Larger touch targets and simplified navigation
- **Performance**: Optimized loading for mobile networks

## 🔐 Security Features

### User Authentication
- Secure login/registration system
- Password validation and strength requirements
- Remember me functionality
- Session management

### Data Protection
- Input sanitization and validation
- XSS prevention measures
- Secure form handling

## 🚀 Future Enhancements

### Planned Features
- **Real-time Chat**: Built-in messaging system
- **Payment Integration**: Stripe, M-Paisa, Vodafone M-PAiSA
- **File Upload**: Task completion proof and attachments
- **Dispute Resolution**: Automated conflict resolution system
- **Email/SMS Alerts**: Notification system
- **Admin Panel**: Content moderation and user management

### Technical Improvements
- **Backend Integration**: Python (Django/Flask) or PHP (Laravel)
- **Database**: MySQL or PostgreSQL
- **Real-time Features**: Firebase for messaging and notifications
- **Progressive Web App**: Offline functionality and app-like experience

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow existing conventions
2. **Testing**: Test across different browsers and devices
3. **Documentation**: Update README for new features
4. **Accessibility**: Ensure WCAG compliance

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is created for educational and demonstration purposes. All rights reserved.

## 📞 Support

For questions or support:
- **Email**: support@fijitaskmarketplace.com
- **Documentation**: [Help Center](help.html)
- **Contact**: [Contact Us](contact.html)

---

**Fiji Task Marketplace** - Connecting skills with opportunities across Fiji. Build your reputation and grow your business with our trusted platform.
