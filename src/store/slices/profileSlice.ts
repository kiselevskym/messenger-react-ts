import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import usersAPI from "../../api/usersAPI";





export const fetchUserUserDataById = createAsyncThunk(
    "profile/fetchUserDataById",
    async (userUID: string) => {
        const response = await usersAPI.getUserById(userUID)
        return response
    }
)
// const fetchUserProfileDataById = createAsyncThunk(
//     'users/fetchProfileDataById',
//     async (userId: string) => {
//         const response = await fetchUserProfileDataById(currentUser.userId)
//         return (await response.json()) as Returned
//     }
// )

interface stateProps {
    data: object & {
      name: string
    },
    status: 'loading' | 'finished' | 'error'
}

const initialState: stateProps = {
    data: {
        name: ""
    },
    status: "loading"
}

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserUserDataById.pending, (state, action)=>{
            state.status = "loading"
        });
        builder.addCase(fetchUserUserDataById.fulfilled, (state, action)=>{
            state.status = "finished"
            // @ts-ignore
            state.data = action.payload
        })


    }
})

export const {} = profileSlice.actions

export default profileSlice.reducer