import { Observable, Subject } from 'rxjs';
import {
  IFeedbackItemRepositoryEngine,
  FeedbackItem,
} from './feedback-item-repository-engine.interface';
import {
  CollectionPath,
  INoSqlDatabase,
} from 'core/engine/no-sql-db/core/no-sql-db';
import {
  ErrorUnknown,
  ErrorWithCode,
  Result,
  resultSuccess,
  resultSuccessVoid,
} from 'utils/results';

export class FeedbackItemRepositoryEngine
  implements IFeedbackItemRepositoryEngine
{
  public readonly onCreate$: Observable<string>;

  private readonly _onCreate$ = new Subject<string>();

  constructor(private db: INoSqlDatabase) {
    this.onCreate$ = this._onCreate$;
  }

  private collectionPath: CollectionPath = ['items'];

  public async get(
    id: string,
  ): Promise<Result<FeedbackItem, ErrorWithCode<'not-found'> | ErrorUnknown>> {
    const result = await this.db.readDocument<FeedbackItem>([
      ...this.collectionPath,
      id,
    ]);
    return result;
  }

  public async create(
    item: FeedbackItem,
  ): Promise<Result<string, ErrorUnknown>> {
    const id = (await this.db.addToCollection(this.collectionPath, item)).id;
    this._onCreate$.next(id);
    return resultSuccess(id);
  }

  public async update(
    id: string,
    updatedItem: Partial<FeedbackItem>,
  ): Promise<Result<void, ErrorUnknown>> {
    await this.db.writeDocument<Partial<FeedbackItem>>(
      [...this.collectionPath, id],
      updatedItem,
    );
    return resultSuccessVoid();
  }

  public async delete(id: string): Promise<Result<void, ErrorUnknown>> {
    await this.db.deleteDocument(
      [...this.collectionPath, id],
    );
    return resultSuccessVoid();
  }
}
