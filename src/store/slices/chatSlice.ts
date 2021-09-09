import {createSlice} from "@reduxjs/toolkit";
import {authSlice} from "./authSlice";

const initialState = {

}

export const chatSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {

    }
})

export const { } = authSlice.actions

export default authSlice.reducer