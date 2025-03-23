export interface CreateFeedbackItemManagerTestFixture {
  submitPage: CreateFeedbackItemUIEngine;
  feedback: FeedbackItemEngine;
  manager: CreateFeedbackItemManager;
}

export const testNewFeedbackItemInput = {
  title: 'New feedback item',
  description: 'Description of new feedback item',
  category: 'test-category',
};

export async function usingCreateFeedbackItemManagerTestFixture(
  test: (fixture: CreateFeedbackItemManagerTestFixture) => Promise<void>
) {
  const createPage = new CreateFeedbackItemUIEngine();
  const feedback = new FeedbackItemEngine();
  const manager = new CreateFeedbackItemManager(feedback, createPage);

  const fixture = { submitPage: createPage, feedback, manager };
  
  await test(fixture)
}

export function givenTheUserInputsDetailsForANewFeedbackItem(
  fixture: CreateFeedbackItemManagerTestFixture,
  testFeedbackItemInput: typeof testNewFeedbackItemInput
) {
  fixture.submitPage.inputTitle(testFeedbackItemInput.title);
  fixture.submitPage.inputDescription(testFeedbackItemInput.description);
  fixture.submitPage.inputCategory(testFeedbackItemInput.category);
}

export async function whenTheUserCreatesTheFeedbackItem(
  fixture: CreateFeedbackItemManagerTestFixture
) {
  fixture.submitPage.submit();
}

export function thenTheFeedbackItemIsCreated(
  fixture: CreateFeedbackItemManagerTestFixture,
  testFeedbackItemInput: typeof testNewFeedbackItemInput
) {
  const createdFeedbackItem = fixture.feedback.getItem();
  expect(createdFeedbackItem.title).toEqual(testFeedbackItemInput.title);
  expect(createdFeedbackItem.description).toEqual(
    testFeedbackItemInput.description
  );
  expect(createdFeedbackItem.category).toEqual(testFeedbackItemInput.category);
}
