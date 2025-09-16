# Git Setup Guide for feedback-fortune

## 🚨 Prerequisites
**Xcode Command Line Tools must be installed first!**

If you see this error: `xcode-select: note: No developer tools were found`
1. Run: `xcode-select --install`
2. Wait for installation to complete (5-10 minutes)
3. Restart Terminal

## 🔧 Manual Git Configuration

### Step 1: Initialize Git Repository
```bash
git init
```

### Step 2: Add GitHub Remote
```bash
git remote add origin https://github.com/JimboTE1990/feedback-fortune.git
```

### Step 3: Configure Git User
```bash
# Replace with your GitHub username and email
git config user.name "YourGitHubUsername"
git config user.email "your.email@example.com"
```

### Step 4: Add Files and Commit
```bash
git add .
git commit -m "Initial commit: Set up local development environment"
```

### Step 5: Set Main Branch and Push
```bash
git branch -M main
git push -u origin main
```

## 🔐 GitHub Authentication

### Option 1: Personal Access Token (Recommended)
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` permissions
3. Use token as password when prompted

### Option 2: SSH Key (Advanced)
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your.email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys
3. Change remote URL: `git remote set-url origin git@github.com:JimboTE1990/feedback-fortune.git`

## 🔄 Daily Workflow

### Making Changes
```bash
# 1. Make your code changes
# 2. Stage changes
git add .

# 3. Commit with message
git commit -m "Description of changes"

# 4. Push to GitHub
git push
```

### Pulling Updates
```bash
# Get latest changes from GitHub
git pull origin main
```

## 🚀 Quick Setup Script

Run the automated setup script:
```bash
./setup-git.sh
```

## 🆘 Troubleshooting

### "Permission denied" error
- Use Personal Access Token instead of password
- Check GitHub username/email configuration

### "Repository not found" error
- Verify repository URL is correct
- Ensure repository is public or you have access

### "Authentication failed" error
- Generate new Personal Access Token
- Clear git credentials: `git config --global --unset credential.helper`

## 🔍 **Troubleshooting Steps:**

### **Step 1: Check if tools are already installed**
Try running:
```bash
git --version
```
If this works, the tools are already installed!

### **Step 2: Check installation status**
```bash
xcode-select -p
```
This will show the current path or give an error if not installed.

### **Step 3: Try alternative installation methods**

#### **Method A: Force reinstall**
```bash
sudo xcode-select --install
```

#### **Method B: Reset and reinstall**
```bash
sudo xcode-select --reset
xcode-select --install
```

#### **Method C: Manual download**
1. Go to [Apple Developer Downloads](https://developer.apple.com/download/more/)
2. Sign in with your Apple ID
3. Download "Command Line Tools for Xcode"
4. Install the downloaded package

### **Step 4: Check system requirements**
- Make sure you're running macOS (not Windows/Linux)
- Ensure you have admin privileges
- Check if you have enough disk space (tools need ~500MB)

### **Step 5: Restart Terminal**
Sometimes a fresh Terminal session helps:
1. Close Terminal completely
2. Reopen Terminal
3. Try `xcode-select --install` again

## 🎯 **Alternative Approach:**
If the dialog still doesn't appear, we can proceed with the git setup using the manual method in the `GIT_SETUP_GUIDE.md` file you have open, or try installing git through Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install git
```

**Try these steps and let me know what happens!**
