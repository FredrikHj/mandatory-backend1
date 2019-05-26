import {BehaviorSubject} from "rxjs";
const chatRoom = '';

export const chatRoom$ = new BehaviorSubject(chatRoom);

export function updateChatRoom(chatRoom) {
  console.log(chatRoom);
  chatRoom$.next(chatRoom);
}
