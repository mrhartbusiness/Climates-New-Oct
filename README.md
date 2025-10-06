# Climate Learning Hub 🌍

An interactive educational website for UK Year 8 students (ages 12-13) to learn about climates and climate graphs. Features gamification, interactive activities, and a printable certificate upon completion.

## 🎯 Features

### Educational Content (60+ minutes)
- **7 Interactive Modules** covering:
  - Introduction to Climate vs Weather
  - Five Major Climate Zones (Tropical, Arid, Temperate, Polar, Mediterranean)
  - Reading and Interpreting Climate Graphs
  - Interactive Graph Building Activity
  - World Climate Explorer
  - Knowledge Quizzes
  - Final Assessment

### Gamification
- Points system with real-time tracking
- Achievement badges (Climate Novice, Graph Master, Climate Expert, etc.)
- Progress bar showing course completion
- Interactive drag-and-drop activities
- Instant feedback on all activities

### Interactive Features
- **Climate Graph Builder**: Click to plot temperature data
- **Drag & Drop Matching**: Match cities to climate types
- **Multiple Quiz Types**: Multiple choice, true/false, checkbox questions
- **Real Climate Data**: Graphs from real cities around the world
- **Printable Certificate**: Personalized with student name, date, and achievements

## 🚀 Quick Start

### Prerequisites
- Node.js and npm (for Firebase CLI)
- Firebase account (free tier is sufficient)

### Installation

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase Project**:
   ```bash
   firebase init hosting
   ```

   When prompted:
   - Select "Use an existing project" or "Create a new project"
   - Choose `public` as your public directory
   - Configure as a single-page app: **Yes**
   - Don't overwrite index.html: **No**

4. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

Your site will be live at: `https://[your-project-id].web.app`

## 🖥️ Local Development

To test locally before deployment:

```bash
# Option 1: Using Firebase CLI
firebase serve

# Option 2: Using Python HTTP server
cd public
python3 -m http.server 8000

# Option 3: Using Node.js http-server (if installed)
cd public
npx http-server
```

Then open `http://localhost:5000` (Firebase) or `http://localhost:8000` (Python) in your browser.

## 🧪 Testing

### Prerequisites for Testing
```bash
# Install Chart.js dependency (required for graphs)
npm install
```

The application includes Chart.js v4.5.0 for rendering interactive climate graphs. The library is bundled locally in `public/chart.umd.js` to avoid CDN issues.

### Testing Checklist
- ✅ **Load Test**: Application loads without console errors
- ✅ **Name Input**: Enter student name and start course
- ✅ **Module Navigation**: Click through all 7 modules
- ✅ **Quiz Interaction**: Answer questions and verify feedback
- ✅ **Graph Building**: Test interactive graph plotting
- ✅ **Certificate Generation**: Complete course and generate certificate
- ✅ **Certificate Printing**: Test print preview (Ctrl+P / Cmd+P)
- ✅ **A4 Format**: Verify certificate fits on single A4 page

### Browser Testing Results
All features have been tested and verified:
- Zero JavaScript errors on page load
- All interactive elements functional
- Certificate displays all completion data correctly
- Print layout optimized for A4 portrait (190mm width)
- Success/error overlays working properly
- Points and badges tracking accurately

### Known Compatibility
- **Chart.js**: v4.5.0 (local copy in public/chart.umd.js)
- **Browsers**: Chrome, Firefox, Safari, Edge (all tested)
- **Print**: A4 portrait format with 8mm margins
- **Mobile**: Responsive design, best on 10"+ screens

## 📁 Project Structure

```
Climates-New-Oct/
├── public/
│   ├── index.html          # Main course interface
│   ├── certificate.html    # Printable certificate page
│   ├── styles.css          # All styling
│   └── app.js             # Interactive functionality
├── firebase.json           # Firebase hosting config
├── .firebaserc            # Firebase project config
├── package.json           # Project metadata
└── README.md             # This file
```

## 🎓 Course Curriculum

### Module 1: Introduction to Climate (5 mins)
- Weather vs Climate
- Why climates matter
- Quick comprehension check

### Module 2: Climate Types (10 mins)
- Five major climate zones
- Characteristics of each climate
- Interactive matching game

### Module 3: Reading Climate Graphs (10 mins)
- Understanding climate graphs
- Temperature and rainfall interpretation
- Graph reading quiz

### Module 4: Interactive Graph Builder (15 mins)
- Hands-on graph creation
- Plot Cairo's climate data
- Accuracy checking

### Module 5: World Climate Explorer (10 mins)
- Identify climates from graphs
- Match cities to climate patterns
- Real-world application

### Module 6: Knowledge Quiz (10 mins)
- 8 comprehensive questions
- Multiple question types
- Instant feedback

### Module 7: Final Assessment (5 mins)
- Graph interpretation challenge
- Comprehensive knowledge check
- Certificate unlocking (60% required)

### Completion (5 mins)
- View achievements and badges
- Generate printable certificate
- Option to retake course

## 🏆 Gamification System

### Points
- Start course: 10 points
- Correct answers: 15-20 points
- Perfect matching: 40 points
- Accurate graph: 50 points
- Quiz questions: 15 points each

### Badges
- **Climate Novice 🌱**: Complete Module 2
- **Graph Master 📊**: Complete Module 4
- **Climate Explorer 🌍**: Complete Module 6
- **Quiz Champion 🎯**: Score 75%+ on quiz
- **Climate Expert 🏆**: Pass final assessment

## 🎨 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, animations, flexbox, grid
- **Vanilla JavaScript**: No framework dependencies
- **Chart.js v4.5.0**: Interactive climate graphs (local copy included)
- **Firebase Hosting**: Fast, secure, and free hosting

### Dependencies
- `chart.js@4.5.0`: Included locally in `public/chart.umd.js` (204KB)
- No CDN dependencies - all assets self-contained
- Install via `npm install` if rebuilding from source

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

### No Backend Required
- All functionality is client-side
- No database needed
- No authentication required
- Pure static hosting

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop computers
- Tablets (iPad, etc.)
- Mobile phones (limited but functional)

Best experience on screens 10" or larger.

## 🖨️ Certificate Printing

Students can print their certificates with:
- Their full name
- Completion date (auto-formatted)
- Total points earned
- Number of badges collected
- Accuracy score (based on first attempts)
- Total retries count
- All learning outcomes achieved

**Print Specifications:**
- Format: A4 portrait (210mm x 297mm)
- Margins: 8mm all sides
- Content width: 190mm (fits perfectly on A4)
- Page breaks: Disabled (single page guaranteed)
- Print CSS: `@media print` optimized
- Buttons: Hidden during print

**To Print:**
1. Complete the course and click "Get Your Certificate"
2. Certificate opens in new tab
3. Click "🖨️ Print Certificate" or press Ctrl+P (Cmd+P on Mac)
4. Select A4 paper size
5. Choose portrait orientation
6. Print or save as PDF

Print-optimized CSS ensures professional appearance on paper.

## 🔧 Customization

### Change Firebase Project
Edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### Modify Course Content
All content is in `public/index.html` - easily editable HTML structure.

### Adjust Styling
All styles in `public/styles.css` - CSS variables at the top for easy theme changes.

### Update Functionality
All JavaScript in `public/app.js` - well-commented and organized by feature.

## 📊 Climate Data Sources

All climate data used in graphs is based on real-world average data:
- London (Temperate)
- Cairo (Arid)
- Mumbai (Tropical)
- Athens (Mediterranean)
- Reykjavik (Polar/Cold)

## 🎯 Learning Outcomes

Upon completion, students will be able to:
1. Distinguish between weather and climate
2. Identify the five major climate zones
3. Read and interpret climate graphs accurately
4. Create climate graphs from data tables
5. Analyze temperature and rainfall patterns
6. Match climate graphs to real-world locations
7. Apply climate knowledge to geography questions

## 📝 License

MIT License - Free for educational use

## 🤝 Contributing

This is an educational project. Feel free to:
- Report bugs or issues
- Suggest improvements
- Adapt for your classroom
- Translate to other languages

## 📞 Support

For issues or questions:
- Check the console for JavaScript errors
- Ensure all files are in the `public/` directory
- Verify Firebase configuration is correct
- Test in different browsers

## 🌟 Credits

Created for UK Year 8 Geography education, aligned with the national curriculum for ages 12-13.

---

**Ready to deploy!** Run `firebase deploy` and share the link with your students! 🚀
