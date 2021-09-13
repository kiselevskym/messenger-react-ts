import {createSlice} from "@reduxjs/toolkit";
import {authSlice} from "./authSlice";
import {useSelector} from "react-redux";




// const fetchUserProfileDataById = createAsyncThunk(
//     'users/fetchProfileDataById',
//     async (userId: string) => {
//         const response = await fetchUserProfileDataById(currentUser.userId)
//         return (await response.json()) as Returned
//     }
// )

interface stateProps {
    name: string
}

const initialState: stateProps = {
    name: ""
}

export const profileSlice = createSlice({
    name: "profileSlice",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        // builder.addCase(fetchUserProfileDataById.pending, (state, action) => {
        //     // both `state` and `action` are now correctly typed
        //     // based on the slice state and the `pending` action creatos
        // })
    },
})

export const {} = profileSlice.actions

export default profileSlice.reducer