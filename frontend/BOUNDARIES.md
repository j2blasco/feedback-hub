# ESLint Boundaries System

This project uses [`eslint-plugin-boundaries`](https://www.npmjs.com/package/eslint-plugin-boundaries) to enforce import boundaries across the TypeScript codebase. The system is driven by per-folder `boundaries.json` definitions that enable decentralized boundary configuration while maintaining centralized enforcement.

## Overview

The system automatically:
- Scans the `src/` directory for `boundaries.json` files
- Generates ESLint configuration based on the boundaries definitions
- Enforces import rules to prevent architectural violations

## How It Works

### 1. Boundary Definitions (`boundaries.json`)

Each folder containing a `boundaries.json` file defines:
- **`type`**: A unique identifier for the boundary zone
- **`allow`**: An array of boundary types that this zone can import from

**Example:**
```json
{
  "type": "core",
  "allow": ["utils", "external"]
}
```

This means files in the `core` boundary can only import from `utils` and `external` boundaries.

### 2. Generated Configuration

The `generate-eslint-boundaries.js` script:
- Recursively scans `src/` for `boundaries.json` files
- Generates `eslint.config.generated.mjs` with appropriate ESLint rules
- Creates patterns like `src/core/*` for each boundary type
- Configures allow/disallow rules based on boundary definitions

### 3. ESLint Integration

The main `eslint.config.mjs` imports and spreads the generated configuration:
```javascript
import generatedBoundaries from './eslint.config.generated.mjs';

export default [
  ...generatedBoundaries,
  // ... other configurations
];
```

## Current Boundary Structure

Based on the existing `boundaries.json` files in the project:

```
src/
├── app/                    (type: "app")
│   └── boundaries.json     → allows: ["core", "utils"]
├── core/                   (type: "core") 
│   └── boundaries.json     → allows: ["utils", "external"]
├── utils/                  (type: "utils")
│   └── boundaries.json     → allows: []
├── external/               (type: "external")
│   └── boundaries.json     → allows: ["utils"]
└── environment/tests/      (type: "environment-tests")
    └── boundaries.json     → allows: ["core", "utils", "external"]
```

### Import Rules

- **`app`** can import from `core` and `utils`
- **`core`** can import from `utils` and `external`
- **`utils`** is self-contained (no imports allowed)
- **`external`** can import from `utils`
- **`environment-tests`** can import from `core`, `utils`, and `external`

## Usage

### Running the System

1. **Generate boundaries configuration:**
   ```bash
   npm run boundaries:generate
   ```

2. **Lint with boundaries enforcement:**
   ```bash
   npm run lint
   ```

3. **Auto-fix linting issues:**
   ```bash
   npm run lint:fix
   ```

### Adding New Boundaries

1. **Create a `boundaries.json` file** in your folder:
   ```json
   {
     "type": "my-new-module",
     "allow": ["utils", "external"]
   }
   ```

2. **Regenerate the configuration:**
   ```bash
   npm run boundaries:generate
   ```

3. **Test the boundaries:**
   ```bash
   npm run lint
   ```

### Example Boundary Violations

If you try to import from a disallowed boundary, ESLint will show an error:

```
src/utils/some-file.ts
  1:1  error  No rule allowing this dependency was found. File is of type 'utils'. Dependency is of type 'core'  boundaries/element-types
```

This means a file in the `utils` boundary is trying to import from `core`, which is not allowed according to the boundary rules.

## Configuration Details

### Script Features

The `generate-eslint-boundaries.js` script:
- ✅ **Idempotent**: Always overwrites the generated config completely
- ✅ **Cross-platform**: Uses POSIX paths regardless of OS
- ✅ **Node.js only**: Uses only core Node.js modules (`fs`, `path`)
- ✅ **Recursive scanning**: Finds `boundaries.json` files in any subdirectory
- ✅ **Error handling**: Gracefully handles malformed JSON or missing files

### ESLint Configuration

The generated `eslint.config.generated.mjs` includes:
- Plugin configuration for `eslint-plugin-boundaries`
- Element patterns for each boundary type
- Rules with `default: 'disallow'` and specific allow rules
- TypeScript resolver configuration for proper import resolution

## Best Practices

### 1. Boundary Design
- **Keep boundaries coarse-grained**: Don't create too many small boundaries
- **Follow dependency direction**: Lower-level modules shouldn't import from higher-level ones
- **Use descriptive names**: Boundary types should clearly indicate their purpose

### 2. File Organization
- **One boundary per logical module**: Each major feature/utility should have its own boundary
- **Place boundaries.json at the root** of each module directory
- **Consistent naming**: Use kebab-case for boundary types

### 3. Maintenance
- **Regenerate after changes**: Always run `npm run boundaries:generate` after updating boundaries
- **Test regularly**: Run `npm run lint` to catch violations early
- **Document changes**: Update this README when adding new boundaries

## Troubleshooting

### Common Issues

1. **"Unknown file extension .ts" error**
   - Use the JavaScript version: `node generate-eslint-boundaries.js`
   - Or ensure TypeScript is properly configured

2. **"No rule allowing this dependency" errors**
   - Check if the target boundary type exists in any `boundaries.json`
   - Verify the `allow` array includes the dependency's boundary type
   - Regenerate the configuration: `npm run boundaries:generate`

3. **Generated config not updating**
   - The script is idempotent - check for syntax errors in `boundaries.json` files
   - Ensure the script has write permissions for `eslint.config.generated.mjs`

4. **Boundaries plugin not detecting violations**
   - Ensure the plugin is properly installed: `npm install --save-dev eslint-plugin-boundaries`
   - The plugin uses CommonJS exports, so it's imported using `createRequire` in the generated config
   - Verify that patterns in `boundaries/elements` match your file structure (e.g., `src/utils/*`)
   - Check that files are being processed by the correct ESLint configuration

### Debug Mode

To see what boundaries are being detected:
```bash
node generate-eslint-boundaries.js
```

The script will output all found `boundaries.json` files and their types.

## Integration with CI/CD

Add boundary enforcement to your CI pipeline:

```yaml
# .github/workflows/lint.yml
- name: Generate boundaries
  run: npm run boundaries:generate
  
- name: Check boundaries
  run: npm run lint
```

This ensures boundaries are always up-to-date and enforced in automated builds.