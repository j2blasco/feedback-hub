// import {
//   submitFeedbackItem,
//   expectItemToExist,
//   createTestFixture,
//   newFeedbackItemTestInput,
//   inputFeedbackItemDetails,
// } from './create-feedback-item-manager-utils.spec';

// describe('createFeedbackItemManager', () => {
//   it('allows the user to create a new feedback item', async () => {
//     const fixture = createTestFixture();

//     inputFeedbackItemDetails(fixture, newFeedbackItemTestInput);

//     const createdItemId = await submitFeedbackItem(fixture);

//     expectItemToExist(fixture, createdItemId, newFeedbackItemTestInput);
//   });
// });

// TODO: this should give a linting error
// import { resultSuccess } from '@j2blasco/ts-result';
import { resultSuccess } from 'utils/result';

// import { resultSuccess } from '../../utils/results';

function _test() {
  return resultSuccess(1);
}
