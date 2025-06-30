import { IFeedbackItemRepositoryEngine } from 'core/engine/data-repository/feedback-item/feedback-item-repository-engine.interface';
import { ICreateFeedbackItemUIEngine } from 'core/engine/ui/create-feedback-item/create-feedback-item.interface';
import { map } from 'rxjs';

export class CreateFeedbackItemManager {
  constructor(
    ui: ICreateFeedbackItemUIEngine,
    repository: IFeedbackItemRepositoryEngine,
  ) {
    ui.onSubmit$
      .pipe(
        map((item) => {
          repository.create(item);
        }),
      )
      .subscribe();
  }
}
