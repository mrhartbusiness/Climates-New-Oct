# Deployment Guide 🚀

## Quick Deployment to Firebase

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window for you to authenticate with your Google account.

### Step 3: Create a Firebase Project

**Option A: Use Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "climate-learning-hub")
4. Follow the setup wizard
5. Copy your project ID

**Option B: Use CLI**
```bash
firebase projects:create climate-learning-hub
```

### Step 4: Update Firebase Configuration

Edit `.firebaserc` and replace the project ID:

```json
{
  "projects": {
    "default": "your-project-id-here"
  }
}
```

### Step 5: Deploy!

```bash
firebase deploy
```

Your site will be live at: `https://your-project-id.web.app`

---

## Alternative: Test Locally First

Before deploying, test the site locally:

```bash
firebase serve
```

Then visit: `http://localhost:5000`

---

## Alternative Hosting Options

### Option 1: GitHub Pages

1. Create a GitHub repository
2. Push the `public/` folder contents to the `gh-pages` branch
3. Enable GitHub Pages in repository settings
4. Your site will be at: `https://username.github.io/repo-name`

### Option 2: Netlify

1. Create account at [Netlify](https://www.netlify.com/)
2. Drag and drop the `public/` folder
3. Site is live instantly!
4. Get a custom URL

### Option 3: Vercel

1. Create account at [Vercel](https://vercel.com/)
2. Install Vercel CLI: `npm i -g vercel`
3. Run: `vercel --prod`
4. Follow prompts

### Option 4: Any Static Host

Simply upload the contents of the `public/` folder to any web server:
- Amazon S3 + CloudFront
- Azure Static Web Apps
- Cloudflare Pages
- Any shared hosting with HTML support

---

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All 7 modules are accessible
- [ ] Climate graphs render properly (Chart.js loads from CDN)
- [ ] Drag and drop works
- [ ] Points system updates
- [ ] Badges appear
- [ ] Certificate generates and prints correctly
- [ ] Responsive design works on mobile/tablet
- [ ] All quiz feedback displays correctly

---

## Troubleshooting

### Charts Not Displaying
- Check internet connection (Chart.js loads from CDN)
- Open browser console for errors
- Verify CDN link in index.html

### Certificate Not Opening
- Check browser popup blocker
- Ensure sessionStorage is enabled
- Try different browser

### Drag and Drop Not Working
- Test in modern browser (Chrome, Firefox, Safari, Edge)
- Check JavaScript console for errors

### Firebase Deployment Fails
- Verify you're logged in: `firebase login`
- Check project ID in `.firebaserc`
- Ensure `public` directory exists
- Try: `firebase deploy --debug`

---

## Custom Domain Setup (Firebase)

1. In Firebase Console, go to Hosting
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS verification steps
5. Add provided DNS records to your domain registrar
6. Wait for SSL certificate provisioning (24-48 hours)

---

## Updating the Site

After making changes:

```bash
firebase deploy
```

Changes are live instantly!

---

## Performance Tips

The site is already optimized:
- ✅ No backend required
- ✅ Minimal dependencies (only Chart.js)
- ✅ All assets inline (CSS, JS)
- ✅ Static hosting
- ✅ Mobile responsive

For even better performance:
- Use Firebase CDN (automatic with Firebase Hosting)
- Enable caching headers
- Consider minifying CSS/JS for production

---

## Cost

**Firebase Hosting Free Tier:**
- 10 GB storage
- 360 MB/day bandwidth
- More than enough for a classroom!

**GitHub Pages:** Free

**Netlify:** Free tier available

**Vercel:** Free tier available

All options have free tiers suitable for educational use! 🎓
