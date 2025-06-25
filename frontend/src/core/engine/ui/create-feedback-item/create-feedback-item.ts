import { Subject } from 'rxjs';
import { ICreateFeedbackItemUIEngine, SubmittedFeedbackITem } from './create-feedback-item.interface';

import { resultSuccess } from 'utils/result';

function _test() {
  return resultSuccess(1);
}

export class CreateFeedbackItemUIEngine implements ICreateFeedbackItemUIEngine {
  private title = '';
  private description = '';
  private category = '';
  private submitSubject = new Subject<SubmittedFeedbackITem>();

  inputTitle(title: string): void {
    this.title = title;
  }

  inputDescription(description: string): void {
    this.description = description;
  }

  inputCategory(category: string): void {
    this.category = category;
  }

  submit(): void {
    const newFeedbackItem: SubmittedFeedbackITem = {
      title: this.title,
      description: this.description,
      category: this.category,
    };
    this.submitSubject.next(newFeedbackItem);
  }

  get onSubmit$() {
    return this.submitSubject.asObservable();
  }
}