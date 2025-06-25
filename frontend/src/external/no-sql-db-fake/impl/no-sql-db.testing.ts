/* eslint-disable @typescript-eslint/no-explicit-any */
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { NoSqlDbQueryConstraint } from '../no-sql-db-constraints';
import {
  INoSqlDatabase,
  NoSqlDbPath,
  DocumentPath,
  CollectionPath,
} from '../no-sql-db.interface';
import {
  ErrorWithCode,
  Result,
  resultError,
  resultSuccess,
} from 'utils/result';

export function createNoSqlDatabaseTesting() {
  return new NoSqlDatabaseTesting();
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  for (const key of Object.keys(source)) {
    if (
      source[key] instanceof Object &&
      key in target &&
      target[key] instanceof Object &&
      !(target[key] instanceof Array)
    ) {
      deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      );
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

type DataStore = Record<string, unknown>;

export class NoSqlDatabaseTesting implements INoSqlDatabase {
  private dataStore: DataStore = {};

  public onWrite$ = new Subject<{
    path: NoSqlDbPath;
    before: unknown | null;
    after: unknown;
  }>();

  private fakeCommunicationDelayMs = 0;

  private async simulateCommunicationDelay(): Promise<void> {
    return new Promise((resolve) => {
      const start = performance.now();
      const checkDelay = () => {
        if (performance.now() - start >= this.fakeCommunicationDelayMs) {
          resolve();
        } else {
          setTimeout(checkDelay, 0);
        }
      };
      checkDelay();
    });
  }

  public onDelete$ = new Subject<{ path: NoSqlDbPath; before: unknown }>();

  public async readDocument(
    path: DocumentPath,
  ): Promise<Result<any, ErrorWithCode<'not-found'>>> {
    await this.simulateCommunicationDelay();
    const element = this.getElementAtPath(path);
    if (!element) {
      return resultError.withCode('not-found');
    }
    return resultSuccess(this.copyElement(element));
  }

  private copyElement(element: unknown): unknown {
    return JSON.parse(JSON.stringify(element));
  }

  public async readCollection<T>(args: {
    path: CollectionPath;
    constraints?: Array<NoSqlDbQueryConstraint<T>>;
  }): Promise<Array<{ data: T; id: string }>> {
    await this.simulateCommunicationDelay();
    const collection = this.getElementAtPath(args.path);
    if (!collection || typeof collection !== 'object') {
      return [];
    }

    let documents = Object.entries(collection).map(([id, doc]) => ({
      id,
      data: doc as T,
    }));

    if (!args.constraints) return documents;

    for (const constraint of args.constraints) {
      if (constraint.type === 'where') {
        const constraintValue = constraint.value as any;
        documents = documents.filter((doc) => {
          const fieldValue = doc.data[constraint.field as keyof T];
          switch (constraint.operator) {
            case '<':
              return fieldValue < constraintValue;
            case '<=':
              return fieldValue <= constraintValue;
            case '==':
              return fieldValue === constraintValue;
            case '>=':
              return fieldValue >= constraintValue;
            case '>':
              return fieldValue > constraintValue;
            default:
              return false;
          }
        });
      } else if (constraint.type === 'array-contains') {
        documents = documents.filter((doc) => {
          const fieldValue = doc.data[constraint.field as keyof T];
          return (
            Array.isArray(fieldValue) && fieldValue.includes(constraint.value)
          );
        });
      } else if (constraint.type === 'limit') {
        documents = documents.slice(0, constraint.value);
      }
    }

    return documents;
  }

  private getElementAtPath(path: NoSqlDbPath): unknown {
    return path.reduce((acc: unknown, key: string) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, this.dataStore);
  }

  public async addToCollection(
    path: CollectionPath,
    data: unknown,
  ): Promise<{ id: string }> {
    await this.simulateCommunicationDelay();
    let element: DataStore = this.dataStore;
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (!element[key]) {
        element[key] = {};
      }
      element = element[key] as DataStore;
    }

    const id = uuidv4();
    element[id] = data;
    this.onWrite$.next({
      path: [...path, id],
      before: null,
      after: this.copyElement(data as any),
    });
    return { id };
  }

  public async writeDocument(path: DocumentPath, data: unknown): Promise<void> {
    await this.simulateCommunicationDelay();
    data = this.copyElement(data);
    // Traverse to the second-to-last element in the path, creating any missing levels
    const parentElement = path
      .slice(0, -1)
      .reduce((acc: unknown, key: string) => {
        if (acc && typeof acc === 'object') {
          if (!(key in acc)) (acc as Record<string, unknown>)[key] = {};
          return (acc as Record<string, unknown>)[key];
        }
        return undefined;
      }, this.dataStore);
    const lastKey = path[path.length - 1];
    // Capture the current state of the data before modification
    const before =
      parentElement &&
      typeof parentElement === 'object' &&
      (parentElement as Record<string, unknown>)[lastKey]
        ? this.copyElement((parentElement as Record<string, unknown>)[lastKey])
        : null;
    // Merge existing data with new data if it's an object, otherwise overwrite
    if (
      parentElement &&
      typeof parentElement === 'object' &&
      (parentElement as Record<string, unknown>)[lastKey] &&
      typeof (parentElement as Record<string, unknown>)[lastKey] === 'object'
    ) {
      deepMerge(
        (parentElement as Record<string, unknown>)[lastKey] as Record<
          string,
          unknown
        >,
        data as Record<string, unknown>,
      );
    } else if (parentElement && typeof parentElement === 'object') {
      (parentElement as Record<string, unknown>)[lastKey] = data;
    }
    // Emit the event after the data modification
    this.onWrite$.next({
      path,
      before: this.copyElement(before),
      after: this.copyElement(
        parentElement && typeof parentElement === 'object'
          ? (parentElement as Record<string, unknown>)[lastKey]
          : undefined,
      ),
    });
  }

  public async deleteDocument(path: DocumentPath): Promise<void> {
    await this.simulateCommunicationDelay();

    const parentElement = path
      .slice(0, -1)
      .reduce((acc: any, key: string) => acc && acc[key], this.dataStore);
    const lastKey = path[path.length - 1];

    if (parentElement && lastKey in parentElement) {
      const before = this.copyElement(parentElement[lastKey]);
      delete parentElement[lastKey];
      this.onDelete$.next({ path, before: this.copyElement(before) });
    }
  }

  public async deleteCollection(path: CollectionPath): Promise<void> {
    const parentElement = path
      .slice(0, -1)
      .reduce((acc: any, key: string) => acc && acc[key], this.dataStore);
    const lastKey = path[path.length - 1];

    await this.simulateCommunicationDelay();

    if (parentElement && lastKey in parentElement) {
      const before = this.copyElement(parentElement[lastKey]);
      delete parentElement[lastKey];

      if (before && typeof before === 'object' && !Array.isArray(before)) {
        Object.keys(before as object).forEach((docId) => {
          this.onDelete$.next({
            path: [...path, docId],
            before: this.copyElement(
              (before as Record<string, unknown>)[docId],
            ),
          });
        });
      }
    }
  }
}
