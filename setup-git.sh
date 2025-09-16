#!/bin/bash

# Git Configuration Script for feedback-fortune
# Run this after Xcode command line tools are installed

echo "🚀 Setting up Git for feedback-fortune project..."

# Initialize git repository
echo "📁 Initializing git repository..."

git init

# Add remote origin
echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/JimboTE1990/feedback-fortune.git

# Configure git user (replace with your GitHub username and email)
echo "👤 Configuring git user..."
echo "Please enter your GitHub username:"
read -p "Username: " GITHUB_USERNAME
echo "Please enter your GitHub email:"
read -p "Email: " GITHUB_EMAIL

git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_EMAIL"

# Add all files
echo "📝 Adding all files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Set up local development environment"

# Set up main branch
echo "🌿 Setting up main branch..."
git branch -M main

# Push to GitHub (this will require authentication)
echo "⬆️  Pushing to GitHub..."
echo "You may need to authenticate with GitHub (Personal Access Token recommended)"
git push -u origin main

echo "✅ Git setup complete!"
echo "🎯 Your local changes will now sync with GitHub"
echo "📋 To sync changes in the future, use:"
echo "   git add ."
echo "   git commit -m 'Your commit message'"
echo "   git push"
