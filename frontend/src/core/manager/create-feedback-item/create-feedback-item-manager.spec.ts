import {
  submitFeedbackItem,
  expectItemToExist,
  createTestFixture,
  newFeedbackItemTestInput,
  inputFeedbackItemDetails,
} from './create-feedback-item-manager-utils.spec';

describe('CreateFeedbackItemManager', () => {
  it('allows the user to create a new feedback item', async () => {
    const fixture = createTestFixture();

    inputFeedbackItemDetails(fixture, newFeedbackItemTestInput);

    const createdItemId = await submitFeedbackItem(fixture);

    await expectItemToExist(fixture, createdItemId, newFeedbackItemTestInput);
  });
});
