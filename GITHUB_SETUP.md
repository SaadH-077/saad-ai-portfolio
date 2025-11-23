# GitHub & Vercel Setup Guide

Since the GitHub CLI (`gh`) is not installed on your system, you'll need to create the repository manually on the GitHub website.

## Step 1: Create GitHub Repository

1.  Log in to [GitHub.com](https://github.com).
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  Name your repository (e.g., `saad-ai-portfolio`).
4.  Make it **Private** (Vercel supports private repos on the free plan).
5.  **Do not** initialize with README, .gitignore, or License (we already have these).
6.  Click **Create repository**.

## Step 2: Push Your Code

Once the repository is created, copy the URL (it looks like `https://github.com/YOUR_USERNAME/saad-ai-portfolio.git`).

Run the following commands in your VS Code terminal (replace the URL with your actual repo URL):

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/saad-ai-portfolio.git
git push -u origin main
```

## Step 3: Deploy to Vercel

1.  Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  You should see your new repository `saad-ai-portfolio` in the list. Click **Import**.
4.  Vercel will auto-detect the settings:
    *   **Framework Preset:** Vite
    *   **Root Directory:** `./`
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
5.  Click **Deploy**.

## Troubleshooting

*   **"Remote origin already exists"**: If you made a mistake, run `git remote remove origin` and try again.
*   **Authentication**: If asked for a password when pushing, use a [Personal Access Token](https://github.com/settings/tokens) if you don't have Git Credential Manager set up.
