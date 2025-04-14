import { Observable } from 'rxjs';

export type SubmittedFeedbackITem = {
  title: string;
  description: string;
  category: string;
};

export interface ICreateFeedbackItemUIEngine {
  inputTitle(title: string): void;
  inputDescription(description: string): void;
  inputCategory(category: string): void;
  submit(): void;
  onSubmit$: Observable<SubmittedFeedbackITem>;
}
