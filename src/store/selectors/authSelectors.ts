import {RootState} from "../store";

export const selectAuthIsLoaded = (state: RootState) => state.auth.isLoaded
export const selectAuthCurrentUser = (state: RootState) => state.auth.currentUser