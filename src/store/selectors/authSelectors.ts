import {RootState} from "../store";

export const selectAuthIsLoaded = (state: RootState) => state.auth.isLoaded
export const selectUid = (state: RootState) => state.auth.uid
export const selectIsAuth = (state: RootState) => state.auth.isAuth