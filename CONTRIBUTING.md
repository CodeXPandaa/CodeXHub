# Contributing Guidelines

Thank you for your interest in contributing to the Project Management Web App!

## How to Contribute

### 1. Report Bugs

- Check existing issues first
- Include steps to reproduce
- Add screenshots if applicable
- Mention your environment (OS, browser, Node version)

### 2. Suggest Features

- Describe the feature in detail
- Explain the use case
- Discuss potential implementation approaches

### 3. Submit Code

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push and create a Pull Request

## Development Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/project-management-app.git

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Create .env file in backend folder
# Add environment variables (see README.md)

# Start MongoDB (if local)
mongod

# Start backend (in one terminal)
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

## Code Style

### JavaScript/JSX
- Use ES6+ features
- Use functional components with hooks
- Follow Airbnb style guide
- Use Prettier for formatting

### Naming Conventions
- Components: PascalCase (e.g., `ProjectCard`)
- Files: match component name
- Utils: camelCase (e.g., `generateToken.js`)
- Constants: UPPER_SNAKE_CASE

### Commits
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example:
```
feat: add WPR file upload functionality
```

## Testing

Before submitting a PR:
- Test all user flows
- Verify responsive design
- Check console for errors
- Test with different user roles

## Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes
```

## Areas for Contribution

### High Priority
- Unit tests for controllers
- Integration tests for API
- End-to-end tests
- Accessibility improvements
- Performance optimizations

### Medium Priority
- Email notifications
- Export reports to PDF
- Advanced filtering
- Dark mode
- Mobile app version

### Nice to Have
- Real-time collaboration features
- File preview in browser
- Comment system for WPRs
- Project templates
- Analytics exports

## Questions?

Open an issue for any questions or discussions.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Accept constructive criticism
- Focus on what's best for the community
