import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import default_image from "../../assets/img/default-user-image.png"


interface Props {
    communicationWith: string | undefined
    username: string | null,
    isLoaded: boolean,
    picture: string
}

const initialState: Props = {
    communicationWith: undefined,
    username: null,
    picture: default_image,
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
        setUsername: (state, action: PayloadAction<string | null>) => {
            state.username = action.payload
        }
    }
})

export const {setCommunicationWith} = chatSlice.actions

export default chatSlice.reducer