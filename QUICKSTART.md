# Quick Start Guide ⚡

## Get Your Climate Learning Hub Live in 5 Minutes!

### Option 1: Firebase Hosting (Recommended) 🔥

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy!
firebase deploy
```

**Done!** Your site is live at `https://[your-project-id].web.app`

---

### Option 2: Test Locally First 💻

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Serve locally
firebase serve

# Open browser to http://localhost:5000
```

---

### Option 3: Netlify (Drag & Drop) 🎯

1. Go to [netlify.com](https://netlify.com)
2. Sign up (free)
3. Drag the `public/` folder onto Netlify
4. **Done!** Instant live site

---

### Option 4: GitHub Pages 📄

```bash
# Create GitHub repo
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main

# Create gh-pages branch with public folder
git subtree push --prefix public origin gh-pages
```

Enable GitHub Pages in repo settings → Pages → Source: gh-pages branch

---

## What's Included? 📦

- ✅ 7 interactive modules (60+ minutes)
- ✅ Gamification with points & badges
- ✅ Climate graph builder
- ✅ Drag-and-drop activities
- ✅ Comprehensive quizzes
- ✅ Printable certificates
- ✅ Fully responsive design
- ✅ No backend needed!

---

## First-Time Setup (Firebase Only)

If you haven't created a Firebase project yet:

```bash
# Login
firebase login

# Create project
firebase projects:create your-project-name

# Update .firebaserc with your project ID
# Then deploy
firebase deploy
```

---

## Quick Test Checklist ✓

After deployment:

1. **Open the site** - Does it load?
2. **Enter your name** - Does the course start?
3. **Complete Module 1** - Do quizzes work?
4. **Try Module 2** - Does drag-and-drop work?
5. **Check Module 3** - Do graphs display?
6. **Build a graph** - Module 4 graph builder?
7. **Finish course** - Does certificate generate?
8. **Print certificate** - Does it print nicely?

---

## Need Help? 🆘

**Graphs not showing?**
- Check internet connection (Chart.js loads from CDN)

**Drag-and-drop not working?**
- Use a modern browser (Chrome, Firefox, Safari, Edge)

**Certificate won't open?**
- Check popup blocker settings

**Firebase deployment fails?**
- Make sure you're logged in: `firebase login`
- Check project ID in `.firebaserc`

---

## Customization 🎨

**Change colors:** Edit CSS variables at top of `styles.css`

**Modify content:** Edit text in `index.html`

**Add questions:** Add quiz items in `index.html` and update logic in `app.js`

**Change passing grade:** Edit line in `app.js` (currently 60%)

---

## Share With Students 👨‍🎓👩‍🎓

Once deployed, just share your URL:
- Firebase: `https://your-project.web.app`
- Netlify: `https://your-site.netlify.app`
- GitHub Pages: `https://username.github.io/repo`

Students need:
- ✅ A web browser
- ✅ Internet connection
- ✅ 60 minutes
- ✅ Their name for the certificate!

No login, no signup, no installation! 🎉

---

## Production Ready ✨

This is a **complete, production-ready** educational website:
- Tested and functional
- Responsive design
- Professional appearance
- Educational content aligned with UK Year 8 curriculum
- Ready for immediate classroom use

**Deploy now and start teaching!** 🚀
