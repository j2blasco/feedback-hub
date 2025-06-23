// TODO: this should give a linting error
// import { resultSuccess } from "@j2blasco/ts-result";

import { resultSuccess } from '../../utils/results';

function test() {
  return resultSuccess(1);
}
