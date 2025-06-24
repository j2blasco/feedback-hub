# Import Restrictions with ESLint

## Overview

This project implements an ESLint-based mechanism to control what can be imported, specifically preventing direct imports from external libraries in favor of local abstractions.

## Implementation

### Problem
- Direct imports from external libraries (like `@j2blasco/ts-result`) create tight coupling
- Makes it harder to replace or modify external dependencies
- Reduces control over the API surface exposed to the application

### Solution
- ESLint rule `no-restricted-imports` prevents direct imports from `@j2blasco/ts-result`
- Forces usage of the local abstraction in `src/utils/results.ts`
- Provides clear error messages guiding developers to the correct import path

## Configuration

The ESLint configuration is in `eslint.config.js` and includes:

```javascript
'no-restricted-imports': [
  'error',
  {
    paths: [
      {
        name: '@j2blasco/ts-result',
        message: 'Direct imports from @j2blasco/ts-result are not allowed. Use the abstraction from "src/utils/results" instead.'
      }
    ]
  }
]
```

### Exception for Abstraction Layer
The `src/utils/results.ts` file is explicitly allowed to import from the external library since it serves as the abstraction layer.

## Usage

### ❌ Incorrect (will cause ESLint error):
```typescript
import { resultSuccess } from "@j2blasco/ts-result";
```

### ✅ Correct (through abstraction):
```typescript
import { resultSuccess } from '../../utils/results';
```

## Running the Linter

```bash
# Check for linting issues
npm run lint:check

# Fix auto-fixable issues
npm run lint
```

## Error Message
When a restricted import is detected, ESLint will show:
```
error  '@j2blasco/ts-result' import is restricted from being used. Direct imports from @j2blasco/ts-result are not allowed. Use the abstraction from "src/utils/results" instead  no-restricted-imports
```

## Benefits

1. **Architectural Control**: Enforces the use of abstraction layers
2. **Easier Refactoring**: Changes to external dependencies only require updating the abstraction
3. **Consistent API**: All code uses the same interface regardless of underlying implementation
4. **Clear Guidance**: Developers get immediate feedback on import violations

## Extending the Restrictions

To add more import restrictions, update the `paths` array in `eslint.config.js`:

```javascript
paths: [
  {
    name: '@j2blasco/ts-result',
    message: 'Use the abstraction from "src/utils/results" instead.'
  },
  {
    name: 'another-external-library',
    message: 'Use the abstraction from "src/utils/another-abstraction" instead.'
  }
]
```