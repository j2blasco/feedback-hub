import {
  usingCreateFeedbackItemManagerTestFixture,
  givenTheUserInputsDetailsForANewFeedbackItem,
  testNewFeedbackItemInput,
  whenTheUserCreatesTheFeedbackItem,
  thenTheFeedbackItemIsCreated,
} from './create-feedback-item-manager-utils.spec';

describe('createFeedbackItemManager', () => {
  it('allows the user to create a new feedback item', async () => {
    usingCreateFeedbackItemManagerTestFixture(async (fixture) => {
      givenTheUserInputsDetailsForANewFeedbackItem(
        fixture,
        testNewFeedbackItemInput
      );

      await whenTheUserCreatesTheFeedbackItem(fixture);

      thenTheFeedbackItemIsCreated(fixture, testNewFeedbackItemInput);
    });
  });
});
