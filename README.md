# TKChi Art Studio

A static website for TKChi Art Studio and App Compliance Hub.
Deployed on GitHub Pages.

## Project Structure

```
art_studio_site/
├── index.html                      # Home page with hero, about, apps teaser
├── gallery.html                    # Image gallery with lightbox
├── store.html                      # Product grid with shopping cart
├── apps.html                       # App development showcase
├── css/
│   └── style.css                   # Main stylesheet
├── js/
│   └── script.js                   # JavaScript functionality
├── images/
│   ├── hero-bg.svg                 # Hero section background
│   ├── art1.svg                    # Gallery artwork 1
│   ├── art2.svg                    # Gallery artwork 2
│   ├── art3.svg                    # Gallery artwork 3
│   ├── art4.svg                    # Gallery artwork 4
│   ├── ptr-hero.svg                # Personal Tarot Reader app hero
│   └── cwf-hero.svg                # Coloring With Friends app hero
├── apps/
│   └── personal-tarot-reader.html  # Personal Tarot Reader landing page
├── legal/
│   ├── personal-tarot-reader-privacy.html
│   ├── personal-tarot-reader-terms.html
│   ├── coloring-with-friends-privacy.html
│   └── coloring-with-friends-terms.html
├── docs/                           # Documentation files
├── .nojekyll                       # Disable Jekyll processing
└── README.md                       # This file
```

## Features

- Responsive design (mobile + desktop)
- Gallery with lightbox modal
- Shopping cart with localStorage persistence
- SEO optimized (meta tags, OpenGraph)
- Accessibility compliant (WCAG guidelines)
- Dark industrial minimalist theme
- App compliance hub with legal pages

## Pages

| Page | Description |
|------|-------------|
| index.html | Home page with hero, about, apps teaser |
| gallery.html | Image gallery with lightbox |
| store.html | Product grid with shopping cart |
| apps.html | App development showcase |
| apps/personal-tarot-reader.html | Personal Tarot Reader landing page |
| legal/*.html | Privacy policies and terms for each app |

## Design System

- Colors: #1a1a1a (bg), #242424 (surface), #eeeeee (text), #007acc (accent)
- Font: Montserrat (Google Fonts)
- Layout: Fixed header, CSS Grid, Flexbox

## Local Development

Simply open any HTML file in a browser:

```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# Or use a local server
python3 -m http.server 8000
```

Then visit http://localhost:8000

## GitHub Pages Deployment

### Step 1: Initialize Git Repository

```bash
cd art_studio_site
git init
git add .
git commit -m "Initial commit: TKChi Art Studio website"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Name your repository (e.g., "tkchi-art-studio")
3. Make it Public
4. Do NOT initialize with README (we have one)
5. Click "Create repository"

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll to "Pages" in the left sidebar (or Code and automation > Pages)
4. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: main /root
5. Click "Save"

### Step 5: Wait for Deployment

- GitHub Pages will build and deploy your site (takes 1-5 minutes)
- Visit: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Custom Domain (Optional)

1. Add a file named `CNAME` containing your domain:
   ```
   yourdomain.com
   ```
2. In repository Settings > Pages, add your custom domain
3. Configure DNS with your provider (CNAME record pointing to YOUR_USERNAME.github.io)

## File Manifest

| File | Purpose |
|------|---------|
| index.html | Main landing page |
| gallery.html | Art gallery with lightbox |
| store.html | Products and shopping cart |
| apps.html | App showcase directory |
| css/style.css | Main stylesheet with dark theme |
| js/script.js | All JavaScript functionality |
| images/*.svg | Placeholder artwork images |
| apps/personal-tarot-reader.html | Personal Tarot Reader app page |
| legal/*-privacy.html | Privacy policy pages |
| legal/*-terms.html | Terms of service pages |
| .nojekyll | Disables Jekyll processing |
| README.md | This documentation file |

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

© 2026 TKChi Studio. All rights reserved.
