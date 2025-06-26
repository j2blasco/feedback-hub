import { ICreateFeedbackItemUIEngine } from './create-feedback-item.interface';
import { CreateFeedbackItemUIEngine } from './create-feedback-item';
import {
  observableAsReplaySubject,
} from 'utils/tests/replay-event.spec';
import { firstValueFrom } from 'rxjs';

function createUIEngine(): ICreateFeedbackItemUIEngine {
  return new CreateFeedbackItemUIEngine();
}

describe('CreateFeedbackItemUIEngine', () => {
  let engine: ReturnType<typeof createUIEngine>;

  beforeEach(() => {
    engine = createUIEngine();
  });

  it('should emit a new feedback item on submit', async () => {
    await observableAsReplaySubject(engine.onSubmit$, async (replay) => {
      const expectedValue = {
        title: 'Test Title',
        description: 'Test Description',
        category: 'Test Category',
      };

      engine.inputTitle('Test Title');
      engine.inputDescription('Test Description');
      engine.inputCategory('Test Category');
      engine.submit();

      const emittedValue = await firstValueFrom(replay);      

      expect(emittedValue).toEqual(expectedValue);
    });
  });
});
