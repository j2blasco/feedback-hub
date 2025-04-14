import { Observable, ReplaySubject } from "rxjs";

export function usingReplayEvent<T>(
  observable: Observable<T>,
  callback: (replay: ReplaySubject<T>) => void
): void {
  const replay = new ReplaySubject<T>(1);
  observable.subscribe(replay);
  callback(replay);
}

export async function usingReplayEventAsync<T>(
  observable: Observable<T>,
  callback: (replay: ReplaySubject<T>) => Promise<void>
): Promise<void> {
  const replay = new ReplaySubject<T>(1);
  observable.subscribe(replay);
  await callback(replay);
}