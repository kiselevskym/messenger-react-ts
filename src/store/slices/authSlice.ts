import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface authState {
    uid: string | undefined,
    isAuth: boolean,
    isLoaded: boolean
}

const initialState: authState = {
    uid: undefined,
    isAuth: false,
    isLoaded: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<string | undefined>) => {
            state.uid = action.payload
            if(typeof action.payload === 'string'){
                state.isAuth = true
            }else{
                state.isAuth = false
            }
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