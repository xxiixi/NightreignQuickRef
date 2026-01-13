# Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/) with automatic Emoji prefixes.

## Format

```
<type>(<scope>): <subject>
```

- **type**: Commit type (required)
- **scope**: Affected area (optional)
- **subject**: Short description (required)

## Commit Types

### `feat` - New Feature
Add new functionality.

**Examples:**
```
feat: add character data view
feat(ui): add dark theme toggle
```

### `fix` - Bug Fix
Fix bugs or errors.

**Examples:**
```
fix: resolve data loading failure
fix(api): fix request timeout
```

### `docs` - Documentation
Documentation changes only.

**Examples:**
```
docs: update deployment guide
docs(readme): add usage instructions
```

### `style` - Code Style
Code formatting (indentation, spacing, etc.). **Not CSS styles!**

**Examples:**
```
style: format code
style(components): unify indentation
```

### `css` - CSS Styles
Changes to standalone `.css` files only.

**Examples:**
```
css: adjust button colors
css(theme): add dark mode variables
```

### `refactor` - Refactoring
Code refactoring without bug fixes or new features.

**Examples:**
```
refactor: restructure data management
refactor(utils): optimize utility functions
```

### `perf` - Performance
Performance improvements.

**Examples:**
```
perf: optimize data loading
perf(render): reduce unnecessary re-renders
```

### `test` - Tests
Add or update tests.

**Examples:**
```
test: add component unit tests
test(utils): add edge case tests
```

### `ui` - UI Components/Layout
Component-level UI changes (`.tsx`/`.jsx` files).

**Difference from `css`:**
- `css`: Only standalone `.css` files
- `ui`: Component files with structure and styles

**Examples:**
```
ui: adjust button component layout
ui(header): optimize navigation component
ui: refactor card component
```

### `chore` - Chores
Other changes (dependencies, configs, build, etc.).

**Examples:**
```
chore: update dependencies
chore: update build config
chore: clean up files
```

## Examples

### Correct

```
feat: add boss data view page
fix(api): resolve data loading timeout
docs: update project documentation
refactor(utils): restructure data management
perf: optimize list rendering
```

### Incorrect

```
update code          # Missing type
fix bug              # Missing colon and space
feat:add feature     # Missing space after colon
```

## Auto Emoji Prefix

The system automatically adds Emoji prefixes based on commit type. If the message already contains an Emoji, it won't be duplicated.

**Input:**
```
feat: add new feature
```

**Output:**
```
feat: add new feature
```

## Notes

1. Use concise, clear commit messages
2. Types must be lowercase English
3. Scope is optional
4. Emoji won't be duplicated if already present
5. One change per commit for clear history
