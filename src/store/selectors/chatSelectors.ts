import {RootState} from "../store";

export const selectCommunicationWith = (state: RootState) => state.chat.communicationWith
export const selectChatPicture = (state: RootState) => state.chat.picture
