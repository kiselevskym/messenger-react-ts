import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import usersAPI from "../../api/usersAPI";
import default_profile from "../../assets/img/default-user-image.png"

export const fetchUserDataById = createAsyncThunk(
    "profile/fetchUserDataById",
    async (userUID: string) => {
        const response = await usersAPI.getUserById(userUID)
        return response
    }
)
export const fetchUserProfileImage = createAsyncThunk(
    "profile/fetchUserProfileImage",
    async (userUID: string) => {
        const response = await usersAPI.fetchProfileImageByUID(userUID)
        return response
    }
)


interface stateProps {
    imageURL: string,
    data: object & {
        name: string,
        about: string,
        tag: string
    },
    status: 'loading' | 'finished' | 'error'
}

const initialState: stateProps = {
    imageURL: default_profile,
    data: {
        name: "",
        about: "",
        tag: ""
    },
    status: "loading"
}

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfileStateImageURL: (state, action) => {
            state.imageURL = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserDataById.pending, (state, action) => {
            state.status = "loading"
        });
        builder.addCase(fetchUserDataById.fulfilled, (state, action) => {
            state.status = "finished"
            // @ts-ignore
            state.data = {
                name: action.payload?.name ? action.payload?.name : "",
                about: action.payload?.about ? action.payload?.about : "",
                tag: action.payload?.tag ? action.payload?.tag : "",
            }
        });

        builder.addCase(fetchUserProfileImage.pending, (state, action) => {

        });
        builder.addCase(fetchUserProfileImage.fulfilled, (state, action) => {
            state.imageURL = action.payload
        })


    }
})

export const {setProfileStateImageURL} = profileSlice.actions

export default profileSlice.reducer