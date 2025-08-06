# Medical Clinic Frontend

A simple and clean frontend interface for the Medical Clinic Management System API.

## Features

- ✅ **Patient Management**: View, add, edit, and delete patients
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Real-time Search**: Filter patients instantly
- ✅ **Form Validation**: Client-side validation with helpful messages
- ✅ **Modern UI**: Clean, professional interface with smooth animations
- ✅ **Input Masks**: Automatic formatting for CPF and phone numbers

## Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: No frameworks - lightweight and fast
- **Font Awesome**: Icons for better UX

## Setup

1. **Configure API URL**: Edit the `API_BASE_URL` in `script.js` to point to your backend:
   ```javascript
   const API_BASE_URL = 'http://localhost:3000/api'; // Change this URL
   ```

2. **Serve the files**: Use any web server to serve the static files:
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js http-server
   npx http-server
   
   # Using Live Server (VS Code extension)
   # Just right-click on index.html and select "Open with Live Server"
   ```

3. **Access the application**: Open your browser and navigate to `http://localhost:8080`

## Configuration

### API Integration

The frontend communicates with the backend via REST API calls. Make sure:

1. Your backend API is running on the configured URL
2. CORS is properly configured on the backend to allow frontend requests
3. All required endpoints are available:
   - `GET /api/pacientes` - List patients
   - `POST /api/pacientes` - Create patient
   - `PUT /api/pacientes/:id` - Update patient
   - `DELETE /api/pacientes/:id` - Delete patient

### Deployment

Since this is a static frontend, you can deploy it to:

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repository
- **GitHub Pages**: Push to a repository and enable Pages
- **Any web server**: Upload the files to your server

## File Structure

```
frontend/
├── index.html          # Main HTML file
├── styles.css          # All styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with ES6+ support

## Features Overview

### Patient List
- Grid layout with patient cards
- Real-time search functionality
- Edit and delete buttons for each patient
- Responsive design for all screen sizes

### Add Patient Form
- Required field validation
- Input masks for CPF and phone
- Clean form layout with proper labeling
- Success/error feedback

### Edit Patient Modal
- Pre-populated form with current data
- Same validation as add form
- Modal overlay with backdrop blur

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## Customization

### Colors
Edit the CSS variables in `styles.css` to change the color scheme:
```css
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --danger-color: #dc3545;
  /* Add more custom colors */
}
```

### API URL
Change the API base URL in `script.js`:
```javascript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

This frontend is completely independent and can be deployed separately from the backend API.
