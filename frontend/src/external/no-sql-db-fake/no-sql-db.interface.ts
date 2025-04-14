import { Observable } from 'rxjs';
import { ErrorWithCode, Result } from '../result/result';
import { NoSqlDbQueryConstraint } from './no-sql-db-constraints';

export type CollectionPath =
  | [string]
  | [string, string, string]
  | [string, string, string, string, string];

export type DocumentPath =
  | [string, string]
  | [string, string, string, string]
  | [string, string, string, string, string, string];

export type NoSqlDbPath = string[];

export type NoSqlDatabaseServiceConfig = {
  create: () => INoSqlDatabase;
  mappings: {
    portalPageDbRootPath: string;
  };
};

// NoSQL document database, like Firestore or MongoDB
export interface INoSqlDatabase {
  onWrite$: Observable<{
    path: NoSqlDbPath;
    before: unknown | null;
    after: unknown;
  }>;
  onDelete$: Observable<{
    path: NoSqlDbPath;
    before: unknown;
  }>;

  // Document
  writeDocument<T>(path: DocumentPath, data: T): Promise<void>;
  readDocument<T>(
    path: DocumentPath
  ): Promise<Result<T, ErrorWithCode<'not-found'>>>;
  deleteDocument(path: DocumentPath): Promise<void>;

  // Collection
  readCollection<T>(args: {
    path: CollectionPath;
    constraints?: Array<NoSqlDbQueryConstraint<T>>;
  }): Promise<Array<{ data: T; id: string }>>; //TODO: Add error handling not-found
  addToCollection<T>(path: CollectionPath, data: T): Promise<{ id: string }>;
  deleteCollection(path: CollectionPath): Promise<void>;
}
