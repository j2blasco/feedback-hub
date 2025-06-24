import { usingReplayEvent } from '../../../utils/tests/replay-event.spec';
import { IFeedbackItemRepositoryEngine, NewFeedbackItem } from './feedback-item-engine.interface';

function createEngine(): IFeedbackItemRepositoryEngine {
    throw new Error('Function not implemented.');
}

const testFeedbackItem: NewFeedbackItem = {
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
    usingReplayEvent(engine.onCreate$, (replay) => {
      const id = engine.create(testFeedbackItem);
      replay.subscribe((emittedId) => {
        expect(emittedId).toBe(id);
        done();
      });
    });
  });

  it('should retrieve an item by ID', () => {
    const id = engine.create(testFeedbackItem);
    const item = engine.getItem(id);
    expect(item).toEqual({ id, ...testFeedbackItem });
  });

  it('should update an existing item', () => {
    const id = engine.create(testFeedbackItem);
    const updatedTitle = 'Updated Title';
    engine.update(id, { title: updatedTitle });
    const updatedItem = engine.getItem(id);
    expect(updatedItem.title).toBe(updatedTitle);
  });

  it('should delete an item by ID', () => {
    const id = engine.create(testFeedbackItem);
    engine.delete(id);
    const item = engine.getItem(id);
    expect(item).toBeUndefined();
  });
});