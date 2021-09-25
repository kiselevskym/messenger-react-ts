import {RootState} from "../store";

export const selectProfileState = (state: RootState) => state.profile
export const selectProfileImage = (state: RootState) => state.profile.imageURL
