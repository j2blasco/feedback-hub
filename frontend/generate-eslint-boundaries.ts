#!/usr/bin/env ts-node

const fs = require('fs');
const path = require('path');

interface BoundaryConfig {
  type: string;
  allow: string[];
}

interface BoundaryElement {
  type: string;
  pattern: string;
}

interface BoundaryRule {
  from: string;
  allow: string[];
}

interface GeneratedConfig {
  plugins: string[];
  settings: {
    'boundaries/elements': BoundaryElement[];
  };
  rules: {
    'boundaries/element-types': [string, { default: string; rules: BoundaryRule[] }];
  };
}

class BoundaryConfigGenerator {
  private srcDir: string;
  private outputPath: string;

  constructor(srcDir: string = 'src', outputPath: string = '.eslintrc.generated.json') {
    this.srcDir = srcDir;
    this.outputPath = outputPath;
  }

  /**
   * Recursively finds all boundaries.json files in the src directory
   */
  private findBoundaryFiles(dir: string): string[] {
    const boundaryFiles: string[] = [];
    
    const scanDirectory = (currentDir: string): void => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.name === 'boundaries.json') {
          boundaryFiles.push(fullPath);
        }
      }
    };

    if (fs.existsSync(dir)) {
      scanDirectory(dir);
    }

    return boundaryFiles;
  }

  /**
   * Loads and validates a boundary configuration file
   */
  private loadBoundaryConfig(filePath: string): { config: BoundaryConfig; relativePath: string } | null {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const config = JSON.parse(content) as BoundaryConfig;
      
      // Validate required fields
      if (!config.type || !Array.isArray(config.allow)) {
        console.warn(`Invalid boundary config in ${filePath}: missing 'type' or 'allow' fields`);
        return null;
      }

      // Get relative path from src directory
      const relativePath = path.relative(this.srcDir, path.dirname(filePath));
      
      return { config, relativePath };
    } catch (error) {
      console.error(`Error loading boundary config from ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Converts file system path to POSIX-style path for ESLint patterns
   */
  private toPosixPath(filePath: string): string {
    return filePath.split(path.sep).join('/');
  }

  /**
   * Generates ESLint configuration from boundary files
   */
  public generate(): void {
    console.log('🔍 Scanning for boundaries.json files...');
    
    const boundaryFiles = this.findBoundaryFiles(this.srcDir);
    console.log(`Found ${boundaryFiles.length} boundary files`);

    const elements: BoundaryElement[] = [];
    const rules: BoundaryRule[] = [];

    // Add global default rule: deny all node_modules by default
    rules.push({
      from: '*',
      allow: ['!node_modules/**']
    });

    // Process each boundary file
    for (const filePath of boundaryFiles) {
      const result = this.loadBoundaryConfig(filePath);
      if (!result) continue;

      const { config, relativePath } = result;
      
      // Create element pattern
      const posixRelativePath = this.toPosixPath(relativePath);
      const pattern = posixRelativePath ? `${this.srcDir}/${posixRelativePath}/**` : `${this.srcDir}/**`;
      
      elements.push({
        type: config.type,
        pattern
      });

      // Create rule
      rules.push({
        from: config.type,
        allow: config.allow
      });

      console.log(`✅ Added boundary: ${config.type} (${pattern})`);
    }

    // Generate ESLint configuration
    const eslintConfig: GeneratedConfig = {
      plugins: ['boundaries'],
      settings: {
        'boundaries/elements': elements
      },
      rules: {
        'boundaries/element-types': ['error', { default: 'disallow', rules }]
      }
    };

    // Write configuration to file
    fs.writeFileSync(this.outputPath, JSON.stringify(eslintConfig, null, 2));
    console.log(`🎉 Generated ESLint boundaries configuration: ${this.outputPath}`);
    
    // Log summary
    console.log('\n📊 Summary:');
    console.log(`- Elements: ${elements.length}`);
    console.log(`- Rules: ${rules.length}`);
    console.log('\n🔧 Next steps:');
    console.log('1. Ensure your .eslintrc.json extends from the generated config');
    console.log('2. Run ESLint to enforce the boundaries');
  }
}

// Main execution
if (require.main === module) {
  const generator = new BoundaryConfigGenerator();
  generator.generate();
}