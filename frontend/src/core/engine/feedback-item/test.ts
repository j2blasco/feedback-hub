// TODO: this should give a linting error
// import { resultSuccess } from '@j2blasco/ts-result';

import { usingReplayEvent } from 'utils/tests/replay-event.spec';
import { resultSuccess } from 'utils/result/results';

// import { resultSuccess } from '../../utils/results';

function _test() {
  return resultSuccess(1);
}
