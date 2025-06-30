import { NoSqlDatabaseTesting } from 'core/engine/no-sql-db/providers/fake/no-sql-db.fake';
import { observableAsReplaySubjectAsync } from 'utils/tests/replay-event.spec';
import { FeedbackItemRepositoryEngine } from './feedback-item-repository-engine';
import {
  IFeedbackItemRepositoryEngine,
  FeedbackItem,
} from './feedback-item-repository-engine.interface';
import { resultSuccessVoid } from 'utils/results';

function createEngine(): IFeedbackItemRepositoryEngine {
  return new FeedbackItemRepositoryEngine(new NoSqlDatabaseTesting());
}

const testFeedbackItem: FeedbackItem = {
  title: 'Test Title',
  description: 'Test Description',
  category: 'Test Category',
};

describe('IFeedbackItemRepositoryEngine', () => {
  let engine: IFeedbackItemRepositoryEngine;

  beforeEach(() => {
    engine = createEngine();
  });

  it('should emit onCreate$ when a new item is created', (done) => {
    observableAsReplaySubjectAsync(engine.onCreate$, async (replay) => {
      const id = (await engine.create(testFeedbackItem)).unwrapOrThrow();
      replay.subscribe((emittedId) => {
        expect(emittedId).toBe(id);
        done();
      });
    });
  });

  it('should retrieve an item by ID', async () => {
    const id = (await engine.create(testFeedbackItem)).unwrapOrThrow();
    const item = (await engine.get(id)).unwrapOrThrow();
    expect(item).toEqual(testFeedbackItem);
  });

  it('should update an existing item', async () => {
    const id = (await engine.create(testFeedbackItem)).unwrapOrThrow();
    const updatedTitle = 'Updated Title';
    await engine.update(id, { title: updatedTitle });
    const updatedItem = (await engine.get(id)).unwrapOrThrow();
    expect(updatedItem.title).toBe(updatedTitle);
  });

  it('should delete an item by ID', async () => {
    const id = (await engine.create(testFeedbackItem)).unwrapOrThrow();
    await engine.delete(id);
    const itemResult = await engine.get(id);
    let itemExists = true;
    itemResult.catchError((error) => {
      if (error.code === 'not-found') {
        itemExists = false;
      }
      return resultSuccessVoid();
    });
    expect(itemExists).toBeFalse();
  });
});
