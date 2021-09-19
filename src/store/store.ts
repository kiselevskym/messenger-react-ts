import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import chatReducer from "./slices/chatSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        profile: profileReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const selectAuth = (state: RootState) => state