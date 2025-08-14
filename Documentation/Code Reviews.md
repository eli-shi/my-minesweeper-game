You can ask anyone at anytime to review your code, however there should be a more ‘formal’ code review before a feature branch is merged to the main branch.

## Code Review Checklist

### 1. Code Formatting

- [ ] is the code formatted correctly?
- [ ] does it follow Googles TypeScript guidelines
- [ ] does it follow the projects style guideline
- [ ] does ESlint return any errors?

### 2. Best Practices

- [ ] Does it follow Single Responsibility Principles?
- [ ] Are errors and warnings logged?
- [ ] Magic values avoided?
- [ ] Clean code comments?

### 3. Testing
- [ ] Do unit tests pass?
- [ ] Do manual tests pass?
- [ ] Have all edge cases been discovered?
- [ ] Have all edge cases been tested?
- [ ] Are invalid inputes validated?

### 4. Maintainability
- [ ] Is the code easy to read?
- [ ] Is the code following DRY Principles

### 5. Documentation
- [ ] Is there sufficient documentation?
- [ ] Are all the files up to date?