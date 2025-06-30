import { Observable } from 'rxjs';
import { ErrorUnknown, ErrorWithCode, Result } from 'utils/results';

export interface IFeedbackItemRepositoryEngine {
  onCreate$: Observable<string>;
  get(id: string): Promise<Result<FeedbackItem, ErrorWithCode<'not-found'> | ErrorUnknown>>;
  create(item: FeedbackItem): Promise<Result<string, ErrorUnknown>>;
  update(id: string, updatedItem: Partial<FeedbackItem>): Promise<Result<void, ErrorUnknown>>;
  delete(id: string): Promise<Result<void, ErrorUnknown>>;
}

export interface FeedbackItem {
  title: string;
  description: string;
  category: string;
}
