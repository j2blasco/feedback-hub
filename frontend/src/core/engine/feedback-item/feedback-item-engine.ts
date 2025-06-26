import { Observable } from 'rxjs';
import {
  IFeedbackItemRepositoryEngine,
  FeedbackItem,
  NewFeedbackItem,
} from './feedback-item-engine.interface';

export class FeedbackItemRepositoryEngine
  implements IFeedbackItemRepositoryEngine
{
  public onCreate$: Observable<string> = new Observable<string>();
  getItem(_id: string): FeedbackItem {
    throw new Error('Method not implemented.');
  }
  create(_item: NewFeedbackItem): string {
    throw new Error('Method not implemented.');
  }
  update(_id: string, _updatedItem: Partial<FeedbackItem>): void {
    throw new Error('Method not implemented.');
  }
  delete(_id: string): void {
    throw new Error('Method not implemented.');
  }
}
