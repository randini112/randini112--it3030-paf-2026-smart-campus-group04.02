# Smart Campus Operations Hub

A full-stack web application for university campus management with modern UI and robust backend.

## 🏗️ Project Structure

```
IT3030-PAF_Assignment/
├── frontend/                 # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── layouts/        # Layout components
│   │   └── services/       # API services
│   ├── package.json
│   └── vite.config.js
└── backend/                 # Spring Boot + MongoDB
    ├── src/main/java/com/smartcampus/
    │   ├── controller/     # REST API controllers
    │   ├── model/         # MongoDB document models
    │   ├── repository/    # Spring Data repositories
    │   ├── service/       # Business logic
    │   └── config/        # Configuration classes
    ├── pom.xml
    └── application.yml
```

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Spring Boot 3.1.5** - Java framework
- **MongoDB** - NoSQL database
- **Spring Data MongoDB** - MongoDB integration
- **Maven** - Build and dependency management

## 🎯 Features

### Landing Page
- Modern dark theme with gradient accents
- Professional hero section with call-to-action buttons
- Feature cards highlighting key capabilities
- Responsive design with smooth animations
- Login integration for both students and admins

### Authentication System
- Simulated login with role selection (Student/Admin)
- Protected routes with authentication checks
- User session management with localStorage
- Role-based navigation and access control
- Logout functionality

### Dashboard
- Personalized welcome message with user info
- Real-time statistics cards with icons
- Recent bookings and tickets tables
- Notification system with unread count
- User profile and logout options
- Smooth animations and transitions

### Resource Management
- Comprehensive resource listing with search and filters
- Real-time availability status
- Resource booking interface
- Statistics dashboard (total, available, occupied)
- Category-based filtering (Classrooms, Labs, Halls)

### Booking System
- Create new bookings with date/time selection
- Booking status tracking (Active, Completed, Upcoming, Cancelled)
- Statistics overview with visual indicators
- User-friendly booking interface
- Resource availability checking

### Ticket Management
- Create maintenance and support tickets
- Priority levels (High, Medium, Low)
- Status tracking (Open, In Progress, Resolved)
- Category-based ticket organization
- Comprehensive ticket listing and management

### Notification System
- Real-time notifications for various events
- Filter by read/unread status
- Type-based categorization (Booking, Ticket, Resource, Maintenance)
- Mark as read functionality
- Visual indicators for unread notifications

### Admin Panel
- System statistics and health monitoring
- User management interface
- System logs with level filtering
- System settings and configuration
- Maintenance tools and utilities
- Tab-based navigation for different admin functions

### Backend API
- RESTful endpoints with proper error handling
- Test endpoints for connectivity
- Structured response format
- Error handling and validation
- Ready for MongoDB integration

### UI/UX Enhancements
- Smooth animations and transitions
- Hover effects and micro-interactions
- Loading states and spinners
- Error and success message components
- Responsive design for all screen sizes
- Modern dark theme with cyan/blue accents

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+
- Java 17+
- MongoDB
- Maven

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### MongoDB Setup
Make sure MongoDB is running on localhost:27017

## 🔧 Configuration

### MongoDB Connection
Update `backend/src/main/resources/application.yml`:
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/smartcampus
```

### API Base URL
Frontend API configuration in `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api'
```

## 🌐 API Endpoints

### Test Endpoints
- `GET /api/test` - Test backend connection
- `GET /api/health` - Health check

### Data Models
- **User**: Authentication and role management
- **Resource**: Campus resources (classrooms, labs, etc.)
- **Booking**: Resource booking system
- **Ticket**: Maintenance and issue tracking

## 🎨 UI Components

### Custom CSS Classes
- `.gradient-cyan-blue` - Cyan to blue gradient
- `.card-dark` - Dark themed card
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style

### Color Scheme
- Dark background: `#0f172a`
- Dark surface: `#1e293b`
- Dark border: `#334155`
- Accent cyan: `#06b6d4`
- Accent blue: `#3b82f6`

## 🚀 Getting Started

1. **Start MongoDB**
2. **Start Backend**: `cd backend && mvn spring-boot:run`
3. **Start Frontend**: `cd frontend && npm run dev`
4. **Open Browser**: Navigate to http://localhost:5173
5. **Test Connection**: Click "Get Started" to test API connection

## 📱 Navigation

- **/** - Landing page
- **/dashboard** - Main dashboard
- **/resources** - Resource management (planned)
- **/bookings** - Booking system (planned)
- **/tickets** - Ticket management (planned)
- **/notifications** - Notifications (planned)
- **/admin** - Admin panel (planned)

## 🔮 Future Enhancements

- User authentication system
- Real-time notifications
- Advanced booking features
- File upload capabilities
- Analytics dashboard
- Mobile responsive design
- Email notifications
- Calendar integration

## 🐛 Troubleshooting

### Tailwind CSS Warnings
The `@tailwind` and `@apply` warnings in the IDE are normal and don't affect functionality. They're resolved when the development server runs.

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running on localhost:27017
2. **Port Conflicts**: Make sure ports 5173 and 8080 are available
3. **Java Version**: Ensure Java 17+ is installed
4. **Node Version**: Ensure Node.js 16+ is installed

## 📝 License

This project is part of IT3030 PAF Assignment.
