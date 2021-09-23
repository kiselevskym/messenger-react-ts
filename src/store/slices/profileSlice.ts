import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import usersAPI from "../../api/usersAPI";


export const fetchUserUserDataById = createAsyncThunk(
    "profile/fetchUserDataById",
    async (userUID: string) => {
        const response = await usersAPI.getUserById(userUID)
        return response
    }
)


interface stateProps {
    data: object & {
        name: string,
        about: string,
        tag: string
    },
    status: 'loading' | 'finished' | 'error'
}

const initialState: stateProps = {
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
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserUserDataById.pending, (state, action) => {
            state.status = "loading"
        });
        builder.addCase(fetchUserUserDataById.fulfilled, (state, action) => {
            state.status = "finished"
            // @ts-ignore
            state.data = {
                name: action.payload?.name? action.payload?.name:"",
                about: action.payload?.about? action.payload?.about:"",
                tag: action.payload?.tag? action.payload?.tag:"",
            }
        })


    }
})

export const {} = profileSlice.actions

export default profileSlice.reducer