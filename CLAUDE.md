# Claude Code Instructions

This file contains important instructions for Claude Code when working on this project.

## Project Information
- **Project Name**: Feedback Fortune
- **Tech Stack**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase
- **Repository**: https://github.com/JimboTE1990/feedback-fortune.git

## Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Authentication Setup Required
To push to GitHub, you need to set up authentication:

### Option 1: Personal Access Token
```bash
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/JimboTE1990/feedback-fortune.git
```

### Option 2: GitHub CLI (Recommended)
1. Install GitHub CLI following the instructions in `.cursor/commands/install-github-app.md`
2. Run `gh auth login`
3. Push using `gh repo sync` or regular git commands

## Project Structure
- `/src` - Source code
- `/public` - Static assets
- `/docs` - Documentation
- `/supabase` - Supabase configuration
- `.env` - Environment variables (not in git)

## Important Notes
- All commits should include the Claude Code signature
- Ensure tests pass before pushing (when test setup is complete)
- Follow existing code conventions and patterns