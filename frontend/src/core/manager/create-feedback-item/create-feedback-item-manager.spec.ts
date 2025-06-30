import {
  submitFeedbackItem,
  expectItemToExist,
  createTestFixture,
  newFeedbackItemTestInput,
  inputFeedbackItemDetails,
  TestFixture,
} from './create-feedback-item-manager-utils.spec';


describe('CreateFeedbackItemManager', () => {
  let fixture: TestFixture;

  beforeEach(() => {
    fixture = createTestFixture();
  });

  afterEach(() => {
    fixture.destroyed$.complete();
  })

  it('allows the user to create a new feedback item', async () => {
    inputFeedbackItemDetails(fixture, newFeedbackItemTestInput);

    const createdItemId = await submitFeedbackItem(fixture);

    await expectItemToExist(fixture, createdItemId, newFeedbackItemTestInput);
  });
});
