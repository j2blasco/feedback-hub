import { IFeedbackItemRepositoryEngine } from 'core/engine/feedback-item/feedback-item-engine.interface';
import { ICreateFeedbackItemUIEngine } from 'core/engine/ui/create-feedback-item/create-feedback-item.interface';

export class CreateFeedbackItemManager {
  constructor(
    ui: ICreateFeedbackItemUIEngine,
    repository: IFeedbackItemRepositoryEngine
  ) {}
}
