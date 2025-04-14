import { Observable } from 'rxjs';

export interface IFeedbackItemRepositoryEngine {
  onCreate$: Observable<string>;
  getItem(id: string): FeedbackItem;
  create(item: NewFeedbackItem): string;
  update(id: string, updatedItem: Partial<FeedbackItem>): void;
  delete(id: string): void;
}

export interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: string;
}

export type NewFeedbackItem = Omit<FeedbackItem, 'id'>;
