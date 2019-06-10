import {BehaviorSubject} from "rxjs";

export const currentRoom$ = new BehaviorSubject(window.localStorage.getItem('currentRoom'));

export function updateCurrentRoom(getPathName) {
  currentRoom$.next(getPathName);
}
