# Contributing to TacticDev Worker

Thank you for your interest in contributing to the TacticDev marketing site! This document provides guidelines for contributing to this project.

## Code of Conduct

### Our Standards

- **Be respectful**: Treat everyone with respect and consideration
- **Be collaborative**: Work together to achieve the best outcomes
- **Be professional**: Maintain a professional and constructive tone
- **Be inclusive**: Welcome contributors of all backgrounds and skill levels

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A GitHub account
- Basic knowledge of TypeScript and Cloudflare Workers

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/tacticdev-worker.git
   cd tacticdev-worker
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/tyy130/tacticdev-worker.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start the development server**:
   ```bash
   npm start
   ```

## Development Workflow

### Branching Strategy

- **main**: Production-ready code
- **feature/**: New features (`feature/add-blog-section`)
- **fix/**: Bug fixes (`fix/contact-form-validation`)
- **docs/**: Documentation updates (`docs/update-readme`)

### Making Changes

1. **Create a new branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our code style guidelines

3. **Test your changes** locally:
   ```bash
   npm start
   # Visit http://localhost:8787 to test
   ```

4. **Commit your changes** with a descriptive message:
   ```bash
   git add .
   git commit -m "feat: add social media links to footer"
   ```

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no code change)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples**:
```
feat: add LinkedIn social link to footer
fix: correct email validation regex in contact form
docs: update deployment instructions in README
style: format HTML with consistent indentation
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all code
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add types for all function parameters and return values

### HTML/CSS

- Use semantic HTML5 elements
- Maintain consistent indentation (2 spaces)
- Follow accessibility best practices (ARIA labels, alt text, etc.)
- Keep inline styles organized and commented
- Use CSS custom properties for theme values

### Code Organization

- Keep the main HTML inline in `src/index.ts` for optimal performance
- Separate complex logic into helper functions
- Add comments for non-obvious code
- Keep functions small and focused

## Testing

### Manual Testing

Before submitting a pull request:

1. Test the homepage loads correctly
2. Test the contact form submission
3. Test form validation (missing fields, invalid email)
4. Test on different screen sizes (mobile, tablet, desktop)
5. Test keyboard navigation
6. Test with screen readers if possible

### Automated Tests

While our test coverage is minimal, if you add new functionality:

1. Consider adding tests to `test/index.spec.ts`
2. Run existing tests to ensure nothing breaks:
   ```bash
   npm test
   ```

## Submitting Changes

### Pull Request Process

1. **Update your branch** with the latest changes from upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changes you made and why
   - Include screenshots for visual changes
   - List any manual testing you performed

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] Tested form validation
- [ ] Tested accessibility

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Closes #123
```

### Review Process

- A maintainer will review your PR within 2-3 business days
- Address any requested changes
- Once approved, a maintainer will merge your PR

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Clear title**: Describe the issue concisely
2. **Description**: What happened vs. what should happen
3. **Steps to reproduce**: List exact steps to trigger the bug
4. **Environment**: Browser, OS, screen size
5. **Screenshots**: If applicable

**Example**:
```markdown
**Title**: Contact form shows success message on validation error

**Description**: 
When submitting the contact form with an invalid email, the form shows 
"Thanks — we will reply shortly" instead of an error message.

**Steps to Reproduce**:
1. Go to homepage
2. Scroll to contact form
3. Enter "invalid-email" in email field
4. Click Submit

**Expected**: Validation error message
**Actual**: Success message

**Environment**: Chrome 120, macOS 14, Desktop
```

### Feature Requests

When requesting features, include:

1. **Clear title**: Describe the feature
2. **Problem**: What problem does this solve?
3. **Proposed solution**: How should it work?
4. **Alternatives**: Other solutions you've considered
5. **Use case**: Real-world example

## Content Updates

### Updating Site Copy

When updating marketing copy:

1. **Follow brand voice**: Review [BRAND_VOICE.md](./BRAND_VOICE.md)
2. **Be specific**: Use metrics, not vague claims
3. **Stay founder-focused**: Prioritize the founder's perspective
4. **Proofread**: Check spelling, grammar, punctuation

### Adding Content

When adding new sections:

1. **Match existing style**: Keep visual consistency
2. **Maintain accessibility**: Use semantic HTML and ARIA labels
3. **Optimize performance**: Minimize HTML size
4. **Test responsiveness**: Ensure it works on all screen sizes

## Design Changes

### Visual Updates

When making design changes:

1. **Maintain brand consistency**: Colors, fonts, spacing
2. **Follow accessibility standards**: WCAG 2.1 AA minimum
3. **Ensure responsiveness**: Test on mobile, tablet, desktop
4. **Keep it fast**: Avoid heavy images, optimize assets
5. **Screenshot before/after**: Show the impact of changes

### Color Palette

Use existing CSS custom properties:
```css
--bg-dark: #020617
--text-dark: #f8fafc
--accent: #38bdf8
--accent-strong: #0284c7
```

## Performance Considerations

- Keep the HTML file size minimal (currently ~30KB)
- Avoid external dependencies when possible
- Use inline CSS for critical styles
- Optimize any images before adding
- Test on slow connections

## Accessibility

- Use semantic HTML (`<nav>`, `<article>`, `<section>`, etc.)
- Provide alt text for images
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Use ARIA labels where appropriate
- Test with screen readers when possible

## Questions?

If you have questions about contributing:

- **Email**: hello@tacticdev.com
- **Open an issue**: Describe your question as a GitHub issue
- **Check existing PRs**: See how others have contributed

## Recognition

We appreciate all contributions, no matter how small! Contributors will be:

- Mentioned in release notes (for significant contributions)
- Listed in a CONTRIBUTORS.md file (coming soon)
- Thanked in PR comments

## License

By contributing, you agree that your contributions will be licensed under the same terms as the project.

---

Thank you for helping make TacticDev better! 🚀
