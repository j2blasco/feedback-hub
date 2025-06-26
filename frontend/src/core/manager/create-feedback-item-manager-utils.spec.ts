import { firstValueFrom } from 'rxjs';
import { CreateFeedbackItemUIEngine } from 'core/engine/ui/create-feedback-item/create-feedback-item';
import {
  observableAsReplaySubject,
  observableAsReplaySubjectAsync,
} from 'utils/tests/replay-event.spec';
import { IFeedbackItemRepositoryEngine } from 'core/engine/feedback-item/feedback-item-engine.interface';
import { ICreateFeedbackItemUIEngine } from 'core/engine/ui/create-feedback-item/create-feedback-item.interface';
import { FeedbackItemRepositoryEngine } from 'core/engine/feedback-item/feedback-item-engine';
import { CreateFeedbackItemManager } from './create-feedback-item-manager';

interface TestFixture {
  ui: ICreateFeedbackItemUIEngine;
  repository: IFeedbackItemRepositoryEngine;
  manager: CreateFeedbackItemManager;
}

export const newFeedbackItemTestInput = {
  title: 'New feedback item',
  description: 'Description of new feedback item',
  category: 'test-category',
};

export function createTestFixture(): TestFixture {
  const ui = new CreateFeedbackItemUIEngine();
  const repository = new FeedbackItemRepositoryEngine();
  const manager = new CreateFeedbackItemManager(ui, repository);

  return { ui, repository, manager };
}

export function inputFeedbackItemDetails(
  fixture: TestFixture,
  testFeedbackItemInput: typeof newFeedbackItemTestInput
) {
  fixture.ui.inputTitle(testFeedbackItemInput.title);
  fixture.ui.inputDescription(testFeedbackItemInput.description);
  fixture.ui.inputCategory(testFeedbackItemInput.category);
}

export async function submitFeedbackItem(
  fixture: TestFixture
): Promise<string> {
  let createdItemId: string = "";
  await observableAsReplaySubjectAsync(
    fixture.repository.onCreate$,
    async (replay) => {
      fixture.ui.submit();
      createdItemId = await firstValueFrom(replay);
    }
  );
  return createdItemId;
}

export function expectItemToExist(
  fixture: TestFixture,
  createdItemId: string,
  testFeedbackItemInput: typeof newFeedbackItemTestInput
) {
  const createdFeedbackItem = fixture.repository.getItem(createdItemId);
  expect(createdFeedbackItem.title).toEqual(testFeedbackItemInput.title);
  expect(createdFeedbackItem.description).toEqual(
    testFeedbackItemInput.description
  );
  expect(createdFeedbackItem.category).toEqual(testFeedbackItemInput.category);
}
