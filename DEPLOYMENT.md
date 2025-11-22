# Deployment Instructions

Your portfolio website is built with **Vite + React**. The easiest way to deploy it for free is using **Vercel** or **Netlify**.

## Option 1: Deploy to Vercel (Recommended)

1.  **Push your code to GitHub** (if you haven't already).
2.  Go to [Vercel.com](https://vercel.com) and sign up/login with GitHub.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your GitHub repository (`testing` or whatever you named it).
5.  Vercel will automatically detect it's a Vite project.
    *   **Framework Preset:** Vite
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
6.  Click **Deploy**.

## Option 2: Deploy to Netlify

1.  Go to [Netlify.com](https://netlify.com) and sign up/login.
2.  Click **"Add new site"** -> **"Import from existing project"**.
3.  Connect to GitHub and select your repository.
4.  Netlify should detect the settings:
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
5.  Click **Deploy site**.

## Manual Deployment (Drag & Drop)

If you don't want to use GitHub:

1.  Run `npm run build` in your terminal (you just did this!).
2.  Locate the `dist` folder in your project directory:
    `c:\Users\HP\OneDrive - Higher Education Commission\Desktop\testing\dist`
3.  Go to [Netlify Drop](https://app.netlify.com/drop).
4.  Drag and drop the `dist` folder onto the page.
5.  Your site will be live instantly!

## Important Note

If you see a blank page after deployment, ensure your `vite.config.js` has the correct `base` path if you are deploying to a subdirectory (usually not needed for Vercel/Netlify root domains).
