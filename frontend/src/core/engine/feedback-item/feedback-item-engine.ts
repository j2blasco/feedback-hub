import { Observable } from 'rxjs';
import {
  FeedbackItem,
  IFeedbackItemRepositoryEngine,
  NewFeedbackItem,
} from './feedback-item-engine.interface';

export class FeedbackItemRepositoryEngine
  implements IFeedbackItemRepositoryEngine
{
  public onCreate$: Observable<string> = new Observable<string>();
  getItem(id: string): FeedbackItem {
    throw new Error('Method not implemented.');
  }
  create(item: NewFeedbackItem): string {
    throw new Error('Method not implemented.');
  }
  update(id: string, updatedItem: Partial<FeedbackItem>): void {
    throw new Error('Method not implemented.');
  }
  delete(id: string): void {
    throw new Error('Method not implemented.');
  }
}
