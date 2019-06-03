import {BehaviorSubject} from "rxjs";

export const currentRoom$ = new BehaviorSubject(window.localStorage.getItem('currentRoom'));

export function updateCurrentRoom(getPathName) {
  console.log(getPathName);
  currentRoom$.next(getPathName);
}
