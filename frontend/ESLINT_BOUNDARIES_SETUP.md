# ESLint Plugin Boundaries Setup

## Overview

This project implements a sophisticated import boundary enforcement system using `eslint-plugin-boundaries` with decentralized configuration. Each folder defines its own boundaries via `boundaries.json` files, while maintaining centralized enforcement through ESLint.

## Key Features

✅ **Decentralized Configuration**: Each folder can define its own import rules via `boundaries.json`  
✅ **Centralized Enforcement**: All rules are enforced through a single ESLint configuration  
✅ **Dynamic Generation**: Boundary configuration is automatically generated from folder definitions  
✅ **Node Modules Restrictions**: Global deny-all policy for external dependencies with specific exceptions  
✅ **TypeScript Support**: Fully compatible with TypeScript projects  

## Implementation

### 1. Core Components

#### `generate-eslint-boundaries.ts`
A TypeScript script that:
- Scans the `src/` directory recursively for `boundaries.json` files
- Extracts `type` and `allow` patterns from each file
- Generates ESLint configuration with proper element mappings
- Creates a default deny-all rule for `node_modules` with exceptions

#### `boundaries.json` Files
Per-folder configuration files that define:
```json
{
  "type": "folder-type-name",
  "allow": [
    "pattern1/**",
    "pattern2/**",
    "node_modules/specific-library"
  ]
}
```

#### Generated Configuration
The script outputs `.eslintrc.generated.json` with:
- `boundaries/elements`: Maps folder patterns to types
- `boundaries/element-types`: Defines allowed import relationships

### 2. Current Boundary Configuration

#### `src/utils/boundaries.json`
```json
{
  "type": "utils",
  "allow": [
    "node_modules/@j2blasco/ts-result",
    "utils/**"
  ]
}
```
- **Purpose**: Abstraction layer for external libraries
- **Special Permission**: Only folder allowed to import from `@j2blasco/ts-result`
- **Self-imports**: Can import from other utils

#### `src/core/boundaries.json`
```json
{
  "type": "core",
  "allow": [
    "utils/**",
    "core/**"
  ]
}
```
- **Purpose**: Core business logic
- **Dependencies**: Can only import from utils and other core modules
- **Restriction**: Cannot import from external or app layers

#### `src/external/boundaries.json`
```json
{
  "type": "external",
  "allow": [
    "utils/**",
    "external/**"
  ]
}
```
- **Purpose**: External service adapters and implementations
- **Dependencies**: Can import from utils and other external modules

### 3. Generated ESLint Configuration

The script generates:

```json
{
  "plugins": ["boundaries"],
  "settings": {
    "boundaries/elements": [
      { "type": "core", "pattern": "src/core/**" },
      { "type": "external", "pattern": "src/external/**" },
      { "type": "utils", "pattern": "src/utils/**" }
    ]
  },
  "rules": {
    "boundaries/element-types": [
      "error",
      {
        "default": "disallow",
        "rules": [
          {
            "from": "*",
            "allow": ["!node_modules/**"]
          },
          {
            "from": "core",
            "allow": ["utils/**", "core/**"]
          },
          {
            "from": "external", 
            "allow": ["utils/**", "external/**"]
          },
          {
            "from": "utils",
            "allow": ["node_modules/@j2blasco/ts-result", "utils/**"]
          }
        ]
      }
    ]
  }
}
```

## Usage

### Running the System

```bash
# Generate boundary configuration and lint
npm run lint:check

# Generate boundary configuration and auto-fix issues
npm run lint

# Generate boundary configuration only
npm run boundaries:generate
```

### Package.json Scripts

```json
{
  "scripts": {
    "boundaries:generate": "ts-node generate-eslint-boundaries.ts",
    "lint": "npm run boundaries:generate && ESLINT_USE_FLAT_CONFIG=false eslint \"src/**/*.ts\" --fix",
    "lint:check": "npm run boundaries:generate && ESLINT_USE_FLAT_CONFIG=false eslint \"src/**/*.ts\""
  }
}
```

### Debug Mode

Enable debug output to see how files are categorized:

```bash
ESLINT_PLUGIN_BOUNDARIES_DEBUG=1 npm run lint:check
```

## Architecture Benefits

### 1. **Layered Architecture Enforcement**
- **Utils Layer**: Foundation layer for shared utilities and external library abstractions
- **Core Layer**: Business logic that depends only on utils
- **External Layer**: Adapters and external service integrations
- **App Layer**: Application-specific code (not yet configured)

### 2. **Dependency Inversion**
- Core business logic doesn't depend on external implementations
- External libraries are abstracted through the utils layer
- Easy to replace external dependencies by updating only the utils layer

### 3. **Scalability**
- New boundary types can be added by creating new `boundaries.json` files
- Each team/module can define its own import rules
- Centralized enforcement ensures consistency

## Example Scenarios

### ✅ Allowed Imports
```typescript
// In src/core/some-module.ts
import { resultSuccess } from '../utils/results'; // ✅ Core can import utils
import { AnotherCore } from './another-core';      // ✅ Core can import core

// In src/utils/results.ts  
import { Result } from '@j2blasco/ts-result';      // ✅ Only utils can import this external library
```

### ❌ Forbidden Imports
```typescript
// In src/core/some-module.ts
import { External } from '../external/some-external'; // ❌ Core cannot import external
import { Result } from '@j2blasco/ts-result';         // ❌ Core cannot import external libraries directly

// In src/external/some-external.ts
import { Result } from '@j2blasco/ts-result';         // ❌ External cannot import external libraries directly
```

## Extending the System

### Adding New Boundary Types

1. Create a new folder under `src/`
2. Add a `boundaries.json` file:
   ```json
   {
     "type": "new-type",
     "allow": [
       "utils/**",
       "new-type/**"
     ]
   }
   ```
3. Run `npm run boundaries:generate` to update the configuration

### Modifying Existing Boundaries

1. Edit the relevant `boundaries.json` file
2. Update the `allow` array with new patterns
3. Run `npm run boundaries:generate` to regenerate the configuration

### Adding External Library Exceptions

To allow a new external library:

1. Update `src/utils/boundaries.json`:
   ```json
   {
     "type": "utils",
     "allow": [
       "node_modules/@j2blasco/ts-result",
       "node_modules/new-library",
       "utils/**"
     ]
   }
   ```

2. Create an abstraction in `src/utils/` for the new library
3. Other layers import from the abstraction, not directly from the library

## Files Structure

```
frontend/
├── generate-eslint-boundaries.ts          # Boundary configuration generator
├── .eslintrc.json                         # Main ESLint config (extends generated)
├── .eslintrc.generated.json               # Generated boundary configuration
├── src/
│   ├── utils/
│   │   ├── boundaries.json                # Utils layer boundaries
│   │   └── results.ts                     # External library abstraction
│   ├── core/
│   │   ├── boundaries.json                # Core layer boundaries
│   │   └── ...                            # Core business logic
│   ├── external/
│   │   ├── boundaries.json                # External layer boundaries  
│   │   └── ...                            # External service adapters
│   └── ...
└── package.json                           # Scripts for boundary generation
```

## Benefits Over Simple Import Restrictions

1. **Flexibility**: Each folder can define its own rules rather than global restrictions
2. **Scalability**: Easy to add new boundary types without modifying central configuration
3. **Team Autonomy**: Teams can define boundaries for their modules independently
4. **Maintainability**: Boundary rules live close to the code they govern
5. **Discoverability**: Easy to understand what a module can import by checking its `boundaries.json`

## Error Messages

When a boundary violation is detected, ESLint will show clear error messages:

```
error: Usage of 'external' is not allowed in 'core'  boundaries/element-types
```

This system provides a robust foundation for maintaining clean architecture and preventing unwanted dependencies between layers.