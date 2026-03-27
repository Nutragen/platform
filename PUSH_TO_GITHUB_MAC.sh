#!/bin/bash
echo "================================================"
echo "  Nutragen Central — Push to GitHub"
echo "================================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed."
    echo "Mac: Install Xcode Command Line Tools by running: xcode-select --install"
    echo "Then run this script again."
    exit 1
fi

# Ask for GitHub username
echo "Step 1 of 3: Enter your GitHub username"
read -p "GitHub username: " GITHUB_USER

# Ask for repo name
echo ""
echo "Step 2 of 3: Enter the repository name"
echo "(Suggestion: nutragen-central)"
read -p "Repository name: " REPO_NAME

# Ask for commit message
echo ""
echo "Step 3 of 3: Short description of this update"
read -p "Description (e.g. initial upload): " COMMIT_MSG

echo ""
echo "================================================"
echo "Initializing git and pushing your files..."
echo "================================================"

# Initialize git if not already
if [ ! -d ".git" ]; then
    git init
    echo "Git initialized."
fi

# Add all files
git add .

# Commit
git commit -m "$COMMIT_MSG"

# Set remote
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

# Push
echo ""
echo "Pushing to GitHub..."
echo "You may be asked for your GitHub password or Personal Access Token."
echo ""
git branch -M main
git push -u origin main

echo ""
if [ $? -eq 0 ]; then
    echo "================================================"
    echo "SUCCESS! Your site is on GitHub at:"
    echo "https://github.com/$GITHUB_USER/$REPO_NAME"
    echo "================================================"
    echo ""
    echo "Next step: Connect to Netlify"
    echo "1. Go to netlify.com"
    echo "2. Click 'Add new site' then 'Import from Git'"
    echo "3. Choose GitHub and select $REPO_NAME"
    echo "4. Click Deploy — done!"
else
    echo "================================================"
    echo "Something went wrong. Common fixes:"
    echo ""
    echo "1. Create the repo on GitHub FIRST:"
    echo "   Go to github.com → click + → New repository"
    echo "   Name it: $REPO_NAME"
    echo "   Set Public, click Create — then run this again."
    echo ""
    echo "2. If asked for password, use a Personal Access Token:"
    echo "   github.com → Settings → Developer Settings"
    echo "   Personal Access Tokens → Tokens Classic → Generate"
    echo "   Check 'repo' box → Generate → COPY the token"
    echo "   Use that token as your password"
    echo "================================================"
fi
