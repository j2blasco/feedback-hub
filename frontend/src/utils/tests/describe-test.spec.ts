import { testEnvironment } from '../../environment/tests/test-environment.e2e.spec';
import { exhaustiveCheck } from '../exhaustive-check';

export type TestType = 'unit' | 'integration' | 'e2e';

function shouldRunTest(type: TestType): boolean {
  switch (type) {
    case 'unit':
      return testEnvironment.unit;
    case 'integration':
      return testEnvironment.integration;
    case 'e2e':
      return testEnvironment.e2e;
    default:
      return false;
  }
}

function configureTestTimeout(type: TestType): void {
  if (testEnvironment.debuggerEnabled) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    return;
  }
  switch (type) {
    case 'unit':
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
      break;
    case 'integration':
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
      break;
    case 'e2e':
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
      break;
    default:
      exhaustiveCheck(type);
      throw new Error('Unreachable code');
  }
}

export function describeTest(
  type: TestType,
  title: string,
  callback: () => void,
) {
  if (!shouldRunTest(type)) {
    return;
  }
  configureTestTimeout(type);
  describe(title, callback);
}

export function fdescribeTest(
  type: TestType,
  title: string,
  callback: () => void,
) {
  if (!shouldRunTest(type)) {
    return;
  }
  configureTestTimeout(type);
  fdescribe(title, callback);
}

export function xdescribeTest(
  _type: TestType,
  _title: string,
  _callback: () => void,
) {}