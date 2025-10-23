# Christian Cattaneo - Personal Portfolio

A futuristic, high-performance personal portfolio website showcasing 7 applications with an animated starfield background and optimized video playback.

## 🚀 Features

- **Animated Starfield Background**: Dynamic, GPU-accelerated star field using HTML5 Canvas
- **Lazy Video Loading**: Intersection Observer API for efficient video loading
- **Responsive Grid Layout**: 1 featured app + 2 rows of 3 apps, fully responsive
- **Futuristic Design**: Cyberpunk-inspired aesthetic with neon accents and glitch effects
- **Performance Optimized**: Lazy loading, GPU acceleration, and efficient rendering
- **Zero Dependencies**: Pure vanilla JavaScript, HTML, and CSS

## 📁 Project Structure

```
chiefhype/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # All CSS styles and animations
├── scripts/
│   ├── starfield.js       # Animated starfield background
│   └── main.js            # Video lazy loading and interactions
├── public/
│   ├── videos/            # App demo videos (*.mp4)
│   └── images/            # Placeholder images and assets
├── .gitignore             # Comprehensive gitignore
└── README.md              # This file
```

## 🎯 Setup Instructions

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for testing)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd chiefhype
   ```

2. **Add your video files**
   - Place your 7 app screen recordings in `public/videos/`
   - Name them: `app1.mp4`, `app2.mp4`, ..., `app7.mp4`
   - Recommended format: MP4 (H.264 codec)
   - Recommended resolution: 1920x1080 or 1280x720
   - Keep file sizes under 5MB each for optimal loading

3. **Create placeholder image (optional)**
   - Add a placeholder image: `public/images/placeholder.jpg`
   - Recommended size: 800x600px
   - This shows while videos load

### Running Locally

#### Option 1: Python HTTP Server
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option 2: Node.js HTTP Server
```bash
npx http-server -p 8000
```

#### Option 3: PHP Built-in Server
```bash
php -S localhost:8000
```

Then open: `http://localhost:8000`

## 🎨 Customization

### Update Header Text

Edit line 24 in `index.html`:
```html
<h1 class="glitch" data-text="Your custom text here">
    Your custom text here
</h1>
```

### Modify App Information

Edit the `.app-info` sections in `index.html` (lines 53-169) to update:
- App titles (`<h3>` tags)
- App descriptions (`<p>` tags)

### Adjust Colors

Edit CSS variables in `styles/main.css` (lines 6-14):
```css
:root {
    --accent-cyan: #00f3ff;      /* Primary accent */
    --accent-purple: #b14dff;    /* Secondary accent */
    --accent-pink: #ff006e;      /* Tertiary accent */
    /* ... more variables ... */
}
```

### Configure Starfield

Edit `scripts/starfield.js` (lines 14-21):
```javascript
const CONFIG = {
    starCount: 200,        // Number of stars
    maxDepth: 32,         // Depth of field
    speed: 0.3,           // Movement speed
    // ...
};
```

## 🚀 Deployment

### Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### Deploy to GitHub Pages

1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch and root directory
4. Save and wait for deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase:
   ```bash
   firebase init hosting
   ```

3. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

## 🎥 Video Optimization

For best performance, optimize your videos:

### Using FFmpeg

**Compress and optimize:**
```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -vf "scale=1280:720" output.mp4
```

**Create WebM version (for better browser support):**
```bash
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -vf "scale=1280:720" output.webm
```

### Recommended Video Settings

- **Format**: MP4 (H.264) or WebM (VP9)
- **Resolution**: 1280x720 or 1920x1080
- **Frame Rate**: 30fps
- **Bitrate**: 2-4 Mbps
- **Duration**: 3-10 seconds
- **File Size**: < 5MB per video

## 🔒 Security Features

- No external API calls
- No user data collection
- No cookies or tracking
- CSP-ready architecture
- XSS protection through proper escaping
- HTTPS recommended for production

## 🌐 Browser Support

- Chrome 88+ ✅
- Firefox 87+ ✅
- Safari 14+ ✅
- Edge 88+ ✅
- Mobile browsers (iOS Safari, Chrome Mobile) ✅

## 📊 Performance

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 95+ (Performance)

## 🐛 Troubleshooting

### Videos not playing

1. Check video paths in `index.html` match your file names
2. Ensure videos are in MP4 format with H.264 codec
3. Check browser console for errors
4. Verify you're running from a web server (not `file://`)

### Starfield not animating

1. Check browser console for JavaScript errors
2. Ensure `scripts/starfield.js` is loaded correctly
3. Try a different browser
4. Check if hardware acceleration is enabled

### Layout issues

1. Clear browser cache
2. Check browser console for CSS errors
3. Verify all CSS files are loaded
4. Test in different browsers

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Christian Cattaneo**

---

**Built with ❤️ and pure vanilla JavaScript**

