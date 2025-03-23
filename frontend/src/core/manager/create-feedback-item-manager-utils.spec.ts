interface TestFixture {
  ui: CreateFeedbackItemUIEngine;
  feedback: FeedbackItemEngine;
  manager: CreateFeedbackItemManager;
}

export const newFeedbackItemTestInput = {
  title: 'New feedback item',
  description: 'Description of new feedback item',
  category: 'test-category',
};

export function createTestFixture(): TestFixture {
  const ui = new CreateFeedbackItemUIEngine();
  const feedback = new FeedbackItemEngine();
  const manager = new CreateFeedbackItemManager(feedback, ui);

  return { ui, feedback, manager };
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
  return fixture.ui.submit();
}

export function expectItemToExist(
  fixture: TestFixture,
  createdItemId: string,
  testFeedbackItemInput: typeof newFeedbackItemTestInput
) {
  const createdFeedbackItem = fixture.feedback.getItem(createdItemId);
  expect(createdFeedbackItem.title).toEqual(testFeedbackItemInput.title);
  expect(createdFeedbackItem.description).toEqual(
    testFeedbackItemInput.description
  );
  expect(createdFeedbackItem.category).toEqual(testFeedbackItemInput.category);
}
