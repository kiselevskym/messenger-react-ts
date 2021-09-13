import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authSlice} from "./authSlice";


interface Props {
    communicationWith: string | undefined
    username: string | undefined,
    isLoaded: boolean
}

const initialState: Props = {
    communicationWith: undefined,
    username: undefined,
    isLoaded: false
}

export const chatSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setCommunicationWith: (state, action: PayloadAction<string | undefined>) => {
            state.communicationWith = action.payload
        },
        setLoaded: (state, action: PayloadAction<boolean>) => {
            state.isLoaded = action.payload
        },
        setUsername: (state, action: PayloadAction<string | undefined>) => {
            state.username = action.payload
        }
    }
})

export const {setCommunicationWith} = chatSlice.actions

export default chatSlice.reducer