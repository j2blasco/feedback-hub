import { TestEnvironment } from './test-environment.interface';

export const testEnvironment: TestEnvironment = {
  debuggerEnabled: false,
  unit: false,
  integration: false,
  e2e: true,
};
