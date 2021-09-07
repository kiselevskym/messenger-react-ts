import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import firebase from "firebase/auth";

export interface authState {
    currentUser: firebase.User | null,
    isLoaded: boolean
}

const initialState: authState = {
    currentUser: null,
    isLoaded: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<firebase.User | null>) => {
            state.currentUser = action.payload
        },
        loadingIsStated: (state) => {
            state.isLoaded = false
        },
        loadingIsEnded: (state) => {
            state.isLoaded = true
        }

    },
})

// Action creators are generated for each case reducer function
export const { setCurrentUser, loadingIsStated, loadingIsEnded } = authSlice.actions

export default authSlice.reducer